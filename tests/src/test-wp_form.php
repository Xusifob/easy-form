<?php

/**
 * Class WP_Form_Test
 */
class WP_Form_Test extends WP_UnitTestCase
{


	public $_form;

	public $_user;

	/**
	 * @since 1.0.0
	 */
	public function test__construct()
	{

		// Can create the form with the id
		$form = new WP_Form($this->_form);

		$this->assertFalse($form->getError());

		$this->assertInstanceOf('EF_Input',$form->get_field('title'));
		$this->assertInstanceOf('EF_Textarea',$form->get_field('content'));


		$form = new WP_Form('form-test');

		$this->assertFalse($form->getError());

		$this->assertInstanceOf('EF_Input',$form->get_field('title'));
		$this->assertInstanceOf('EF_Textarea',$form->get_field('content'));

		// Can create the form with the id
		$form = new WP_Form($this->_form,$this->_user);

	}


	/**
	 *
	 * @since 1.0.0
	 *
	 * Sets up the fixture, for example, opens a network connection.
	 * This method is called before a test is executed.
	 */
	public function setUp()
	{
		$post_array = [
				'post_type' => EF_get_post_type(),
				'post_title' => 'form-test',
				'post_status' => 'publish',
		];

		$this->_form = wp_insert_post($post_array);

		add_post_meta($this->_form,'attributes',[
			'id' => 'my-id',
			'class' => 'my-class',
		]);
		add_post_meta($this->_form,'settings',[
				'type' => 'user',
		]);

		$input = json_encode(new EF_Input(null,['name' => 'title']));
		add_post_meta($this->_form,'inputs',$input);
		$input = json_encode(new EF_TextArea(null,['name' => 'content']));
		add_post_meta($this->_form,'inputs',$input);


		$this->_user = wp_create_user('yolo@yolo.fr','yolo');

	}

}
