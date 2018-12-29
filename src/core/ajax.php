<?php

/**
 * @since 1.0.0
 *
 * Handle all ajax calls
 *
 * Class EF_ajax
 */
class EF_ajax
{


	/**
	 * EF_ajax constructor.
	 */
	public function __construct()
	{

		add_action('wp_ajax_EF/stat_impression',array($this,'stat_impression'));
		add_action('wp_ajax_no_priv_EF/stat_conversion',array($this,'stat_conversion'));


		add_action('wp_ajax_EF/load_template',array($this,'load_template'));
		add_action('wp_ajax_EF/load_form_data',array($this,'load_form_data'));

	}


	/**
	 * @since 1.0.0
	 *
	 * Save an impression from a form
	 */
	public function stat_impression()
	{
		if(!isset($_GET['form_id']))
			die(json_encode(array('success' => false, 'error' => __('form id is mandatory'))));


		$this->log_stat(EF_Admin::IMPRESSION);
		die();
	}


	/**
	 * Load a template from the add page
	 *
	 * @since 1.0.0
	 */
	public function load_template()
	{
		if(!isset($_GET['template']))
			self::HTTP_Error(__('Template is required',EF_get_domain()),400);

		if(!isset($_GET['element']))
			self::HTTP_Error(__('Element is required',EF_get_domain()),400);


		$data = $this->get_template($_GET['element'],$_GET['template']);

		if($_GET['element'] === 'inputs') {
            $base = $this->get_template($_GET['element'],'base');

		    $data = str_replace('input-content',$data,$base);
		}




        self::HTTP_Success($data);
	}


    /**
     *
     * @param $element
     * @param $template
     * @return false|string
     */
	protected function get_template($element,$template)
    {
        $file = EF_get_setting('path') . 'src/admin/templates/add/'. $element .'/' . $template . '.php';

        $file = apply_filters('EF_admin_template',array(
            'file' => $file,
            'element' => $element,
            'template' => $template
        ))['file'];

        if(!file_exists($file))
            self::HTTP_Error(sprintf(__('File %s not found',EF_get_domain()),$file),404);

        if(!is_readable($file))
            self::HTTP_Error(__('File not readable',EF_get_domain()),404);

        ob_start();
        include_once ( $file );
        $data = ob_get_clean();

        return $data;
    }



	/**
	 * Load a template from the add page
	 *
	 * @since 1.0.0
	 */
	public function load_form_data()
	{

        $data = array();

        if(isset($_GET['form_id'])) {
            $form_id = $_GET['form_id'];
        }else {
            $form_id = false;
        }

        EF_add::create_wp_form($form_id);

        global $wp_form;

        $data['form'] = $wp_form;
        $data['inputs'] = EF_get_registered_inputs();
        $data['forms'] = EF_get_registered_forms();

        foreach($data['inputs'] as $key => $input){
            $data['inputs'][$key]['data'] = new $input['class']();
        }


        self::HTTP_Success($data);
	}


	/**
	 * @since 1.0.0
	 *
	 * Log some statistics inside the database
	 *
	 * @param string $type
	 */
	protected function log_stat($type = EF_Admin::CONVERSION)
	{

		$data = [
				'ip' => $_SERVER['REMOTE_ADDR'],
				'time' => time(),
				'number' => $this->getNumberOfImpressions(),
		];

		$data['number']++;

		$keys =  [
				'region','lat','lon','custom_data'
		];

		foreach($keys as $key){
			$data[$key] = isset($_GET[$key]) ? $_GET[$key] : false;
		}

		if(null !== $this->getSessionData($type)){

			$old_values = $data;

			$old_values['number']--;
			update_post_meta($_GET['form_id'],$type,$data,$old_values);
		}else {
			// Add the post meta
			$meta_id = add_post_meta( $_GET['form_id'], $type, $data );
		}
		$_SESSION['form-'  . $type] = ['meta' => $meta_id,'number' => $data['number']];

		echo json_encode(array(
				'success' => true,
				'meta_id' => $meta_id
		));
	}

	/**
	 * @param string $type
	 *
	 * @return null|array
	 */
	protected function getSessionData($type = EF_Admin::IMPRESSION)
	{
		return isset($_SESSION['form-' . $type]) ? $_SESSION['form-' . $type] : null;
	}

	/**
	 * @return int
	 */
	protected function getNumberOfImpressions()
	{
		if(is_null($this->getSessionData()))
			return 0;

		else
			return $this->getSessionData()['number'];
	}

	/**
	 * @since 1.0.0
	 *
	 * Save an impression from a form
	 */
	public function stat_conversion()
	{

		if(!isset($_GET['form_id']))
			die(json_encode(array('success' => false, 'error' => __('form id is mandatory'))));

		$this->log_stat(EF_Admin::CONVERSION);

		unset($_SESSION['form-' . EF_Admin::IMPRESSION]);
		die();
	}


	/**
	 * @param $data
	 * @param $status
	 */
	protected static function HTTP_Request($data,$status = 200){

		header('Content-Type: application/json; charset=utf-8',false);
        http_response_code($status);

		echo json_encode(array_merge($data,['status' => $status]));
		die();
	}


	/**
	 * @since 1.0.0
	 *
	 * Return a HTTP success data
	 *
	 * @param $data
	 */
	public static function HTTP_Success($data)
	{
		$data = ['data' => $data];
		self::HTTP_Request($data);
	}


	/**
	 * @since 1.0.0
	 *
	 * Return a HTTP error data
	 *
	 *
	 * @param $data
	 * @param int $status
	 */
	public static function HTTP_Error($data,$status = 404)
	{
		$data = ['error' => $data];
		self::HTTP_Request($data,$status);
	}


}

new EF_ajax();