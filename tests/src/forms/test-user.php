<?php

class EF_User_Form_Test extends WP_UnitTestCase
{


	/**
	 *
	 * @since 1.0.0
	 *
	 * Test the login
	 */
	function test_create()
	{
		$form = new EF_User_Form();
		$form->addSetting('role','editor');

		$data = [
				'email' => 'test@test.fr',
				'first_name' => 'name',
				'last_name' => 'last_name',
				'content' => 'description',
				'password' => 'password',
				'bimbo' => 'zoulou'
		];

		$user_id = $form->create($data);

		$this->assertNotFalse($user_id);

		/** @var WP_User $the_user */
		$the_user = $this->get_last_user();


		// The post is creates correctly
		$this->assertEquals($user_id,$the_user->ID);
		$this->assertEquals('test@test.fr',$the_user->data->user_email);
		$this->assertEquals('test@test.fr',$the_user->data->user_login);
		$this->assertEquals('name',get_user_meta($the_user->ID,'first_name',true));
		$this->assertEquals('last_name',get_user_meta($the_user->ID,'last_name',true));
		$this->assertEquals('description',get_user_meta($the_user->ID,'description',true));


	}


	/**
	 * @return WP_User
	 */
	protected function get_last_user()
	{
		$query_args = array(
				"number" => 1,
				"orderby" => "modified",
				"order" => "DESC",
		);
		$query = new WP_User_Query($query_args);
		return $query->get_results()[0];
	}

	/**
	 * @since 1.0.0
	 *
	 * Test the submit function
	 *
	 */
	function test_update()
	{

		$user_id = wp_create_user('test@test.fr','test','test@test.fr');

		$form = new EF_User_Form();

		$form->addSetting('id',$user_id);

		$form->update([ 'email' => 'kiwi@kiwi.com']);

		$the_user = $this->get_last_user();

		// The post is creates correctly
		$this->assertEquals($user_id,$the_user->ID);
		$this->assertEquals('kiwi@kiwi.com',$the_user->data->user_email);

	}

	/**
	 * @since 1.0.0
	 *
	 * Test the subimt of the form
	 */
	function test_submit()
	{
		$form = new EF_User_Form();

		$data = [
				'_nonce' => $form->getInput('_nonce')->getValue(),
				'_time' => $form->getInput('_time')->getValue() -1,
		];
		$this->assertFalse($form->submit($data));
		$this->assertEquals('The form need a field email',$form->getError());
		$form->setError(false);

		$email = new EF_Email_Input(null,['name' => 'email']);
		$form->addInput($email);

		$this->assertFalse($form->submit($data));
		$this->assertEquals('The form need a field password',$form->getError());
		$form->setError(false);

		$password = new EF_Password_Input(null,['name' => 'password']);
		$form->addInput($password);

		$this->assertFalse($form->submit($data));
		$this->assertEquals('One or more field is missing',$form->getError());
		$form->setError(false);

		$data['email'] = 'test@yolo.com';
		$data['password'] = 'plop';


		$this->assertTrue($form->submit($data));

		$this->assertTrue($form->hasBeenSend());


	}

}
