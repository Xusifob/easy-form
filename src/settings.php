<?php

abstract class EF_Settings_Element extends EF_Html_Element
{

	/**
	 *
	 * @since 1.0.0
	 *
	 * All the settings linked to the field
	 *
	 * @var array
	 */
	protected $settings = [];


	/**
	 * @since 1.0.0
	 *
	 * @var array
	 */
	protected $defaultSettings = [];


    /**
     * EF_Settings_Element constructor.
     *
     * @param array $attributes
     * @param array $settings
     * @throws Exception
     */
	public function __construct( array $attributes = [],array $settings = [] ) {



		$this->setSettings(array_merge($this->defaultSettings,$settings));
		parent::__construct( $attributes );
	}


	/**
	 * @param $key
	 * @return mixed
	 */
	public function getSetting($key){
		return isset($this->settings[$key]) ? $this->settings[$key] : false;
	}

	/**
	 * @return array
	 */
	public function getSettings()
	{
		return $this->settings;
	}

	/**
	 * @param array $settings
	 */
	public function setSettings($settings)
	{
		$this->settings = $settings;
	}

	/**
	 *
	 * @since 1.0.0
	 *
	 * Remove a setting
	 *
	 * @param $key
	 * @return $this
	 */
	public function removeSetting($key)
	{

		if(isset($this->settings[$key])){
			unset($this->settings[$key]);
		}
		return $this;
	}


	/**
	 * @param $key
	 * @param $value
	 * @return $this
	 */
	public function addSetting($key,$value){
		$this->settings[$key] = $value;
		return $this;
	}

}