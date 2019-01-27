<?php

class EF_Mail_Form extends EF_Form
{

    /**
     * @var array
     */
    protected $data;

    /**
     * @var string
     */
    public static $_TYPE = 'email';


    /**
     * @var array
     */
    public static  $_REQUIRED_FIELDS = array(
        'senderName',
        'email',
        'message'
    );


    /**
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array();


    public function __construct($id, array $attributes, array $settings)
    {
        $this->addSetting('recipientEmail',get_option('admin_email'));
        $this->addSetting('recipientName',get_option('blogname'));
        $this->addSetting('subject',__('Email From Easy-Form','easy-form'));

        parent::__construct($id, $attributes, $settings);
    }

    /**
     *
     * Submit the form
     *
     * @Since 1.0.0
     *
     * @param $data
     * @return bool
     */
    public function submit($data){

        if(!$this->isValid($data))
            return false;


        $this->data = $data;
        add_action( 'phpmailer_init', [$this,'configEmail']);

        $this->addSetting('recipientEmail','coucou99999@gmail.com');


        // Create the message
        $message = $this->createMessage($data);
        $subject = $this->createSubject($data);



        $send = wp_mail([
            $this->getSetting('recipientEmail'),
            $this->getSetting('recipientName')
        ],
            $subject,
            $message
            );

        if(!$send){
            $this->setError(__('An error occurs while sending the email','easy-form'));
        }

        // Redirect the user
        $this->redirect();

        return $send;
    }

    /**
     *
     * Send the email to the given email address
     *
     * @Since 1.0.0
     *
     * @param PHPMailer $mailer
     * @return bool
     */
    public function configEmail(PHPMailer $mailer)
    {

        $mailer->isHTML(true);
        $mailer->setLanguage('fr');
        $mailer->CharSet = "UTF-8";
        $data = $this->data;


        if($this->getSetting('senderEmail')){
            $mailer->setFrom($this->getSetting('senderEmail'),$this->getSetting('senderName'));
        }else{
            $mailer->setFrom($data['email'],$data['senderName']);
        }
    }


    /**
     * @param $data
     * @return bool|string
     */
    private function createSubject($data)
    {
        $subject = '';

        // Handle the subject
        if($this->getSetting('subject')){
            $subject =  $this->getSetting('subject');
        }
        if(isset($data['subject'])) {
            $subject = $data['subject'];
        }

        return $subject;
    }

    /**
     * @param string $data
     * @return PHPMailer $mailer
     */
    private function createMessage($data)
    {

        $message = '';

        if($this->getSetting('message')){
            $message .= $this->getSetting('message');
        }

        if(isset($data['message'])) {
            $message .= $data['message'];
        }

        $message = $this->addMetaData($data,$message);

        return $message;

    }

    /**
     * @param $data
     * @param $message
     * @return mixed
     */
    private function addMetaData($data,$message)
    {

        $remove = [
            'message',
            'email',
            'senderName',
            'subject',
            '_nonce',
            '_time',
            '_antispam'
        ];

        foreach($this->getInputs() as $key => $input){
            if(in_array($input->getName(),$remove))
                continue;

            if('file' === $input->getType()){
                //TODO Add file upload implementation
            }


            // Handle multiple elements
            if($input->getAttribute('multiple') === true && is_array($data[$input->getName()])) {
                foreach ($data[$input->getName()] as $val) {
                    $message .= "\n\r<br>" . $input->getName() . ' : ' . $val;
                }
            }else{
                $message .= "\n\r<br>" . $input->getName() . ' : ' . $data[$input->getName()];
            }
        }

        return $message;
    }




    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Contact form','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS
            );

            return $forms;
        });


        add_filter('EF_fields_default_inputs',function($inputs) {

            $inputs['senderName'] = EF_Input::$_TYPE;
            $inputs['email'] = EF_Email_Input::$_TYPE;
            $inputs['message'] = EF_TextArea::$_TYPE;

            return $inputs;

        });


    }


    /**
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    /**
     * @return array
     */
    public function getPossibleFields()
    {
        return self::$_POSSIBLE_FIELDS;
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}