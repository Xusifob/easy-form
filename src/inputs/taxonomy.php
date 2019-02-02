<?php

/**
 * Class EF_Input
 */
class EF_Taxonomy_Input extends EF_Input
{


    public static $_PREFIX = 'ef_tax_';

    /**
     * @var string
     */
    public static $_TYPE = 'taxonomy';

    /**
     * @var array
     */
    protected $defaultAttributes = array();

    /**
     * @var array
     */
    protected $defaultSettings = array(
        'add-to-taxonomy' => true,
    );


    /**
     * @param $data
     */
    public function fillValue($data)
    {
        foreach($data as $key => $datum) {
            if(self::isTaxValue($key)) {
                if($this->getSetting('taxonomy') == self::getTaxValue($key)) {
                    parent::fillValue(array(
                        $this->getName() => $datum,
                    ));
                }
            }
        }
    }


    /**
     *
     * Return weither a POST key is a tax attribute or not
     *
     * @param $value
     * @return bool
     */
    public static function isTaxValue($value)
    {
        return strpos($value,self::$_PREFIX) === 0;
    }


    /**
     *
     * Return the taxonomy according to the POST attribute name
     *
     * @param $value
     * @return mixed
     */
    public static function getTaxValue($value)
    {
     return str_replace(self::$_PREFIX,'',$value);
    }



    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Taxonomy input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


    /**
     * @return WP_Term[]|WP_Error
     */
    public function getTerms()
    {
        $tax = $this->getSetting('taxonomy');

        return get_terms(array('taxonomy' => $tax,'hide_empty' => false));
    }




    public function isValid($data)
    {

        // Field is valid if not required
        if(!$this->isRequired()) {
            return true;
        }

        if($this->getSetting('add-to-taxonomy')) {
            $key = $this->generateName();

            if(!isset($data[$key]) || empty($data[$key])) {
                return false;
            }

            $terms = $this->getTerms();

            $terms_ids = array();
            foreach($terms as $term) {
                $terms_ids[] = $term->term_id;
            }

            if(is_array($data[$key])) {
                $valid = true;
                foreach($data[$key] as $k) {
                    if(!in_array($k,$terms_ids)) {
                        $valid = false;
                    }
                }

                return $valid;


            }else {
                return in_array($data[$key],$terms_ids);
            }

        }


        return parent::isValid($data);
    }


    /**
     *
     * Generate the name in case of taxonomy
     *
     * @return string
     */
    public function generateName()
    {
        return self::$_PREFIX . $this->getSetting('taxonomy');
    }


    /**
     *
     * Returns the input to be displayed
     *
     * @return string
     */
    public function getInput()
    {

        $template = '';

        if($this->getSetting('add-to-taxonomy')) {
            $this->addAttribute('name',$this->generateName());
        }


        if($this->getSetting('multiple')) {
            $this->addAttribute('type','checkbox');
            $this->addAttribute('name',$this->getName() . '[]');
            $this->removeAttribute('required');
        }else {
            $this->addAttribute('type','radio');
        }

        $id = $this->getAttribute('id');
        if(empty($id)) {
            $id = $this->getName();
        }

        $value = $this->getValue();

        foreach($this->getTerms() as $term) {

            $this->addAttribute('id',$id . '_' . $term->term_id);
            $this->addAttribute('value',$term->term_id);
            $this->removeAttribute('checked');

            if(is_array($value)) {

                if(in_array($term->term_id,$value)) {

                    $this->addAttribute('checked',true);
                }

            }else if($value === $term->term_id) {

                $this->addAttribute('checked',true);
            }


            $input = $this->open();
            $template .= sprintf('<label class="%s" >%s %s</label>',$this->getSetting('label-class'),$input,$term->name);
        }

        return $template;



    }


}