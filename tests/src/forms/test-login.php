<?php

class EF_Login_Form_Test extends WP_UnitTestCase
{


	/**
	 *
	 * @since 1.0.0
	 *
	 * Test the login
	 */
	function test_login()
	{
		$form = new EF_Login_Form();

		$new = wp_create_user('test@test.fr','test','test@test.fr');

		$user = $form->login([
				"user_login" => 'test@test.fr',
				'user_password' => 'test'
		]);

		$this->assertEquals($new,$user->ID);
	}

	/**
	 * @since 1.0.0
	 *
	 * Test the submit function
	 *
	 */
	function test_submit()
	{

		$new = wp_create_user('test@test.fr','test','test@test.fr');


		$form = new EF_Login_Form();

		/** @var EF_Login_Form $form */


		$data =  [
				'_nonce' => $form->getInput('_nonce')->getValue(),
				'_time' => $form->getInput('_time')->getValue() -1,
		];

		$this->assertFalse($form->submit($data));
		$this->assertEquals('The form need a field login', $form->getError());
		$data['login'] = 'test@test.fr';
		$email = new EF_Email_Input(null,['name' => 'login']);
		$form->addInput($email);

		$form->setError(false);

		$this->assertFalse($form->submit($data));
		$this->assertEquals('The form need a field password', $form->getError());

		$data['password'] = 'test';
		$password = new EF_Password_Input(null,['name' => 'password']);
		$form->addInput($password);
		$form->setError(false);

		$this->assertEquals($new,$form->submit($data));

		$this->assertTrue($form->hasBeenSend());


	}

}
