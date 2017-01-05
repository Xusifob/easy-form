<?php

class EF_URL_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_URL_Input();

		$this->assertEquals('url', $input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_URL_Input(null,['name'=> 'name']);


		// Test false
		$this->assertEquals($input->isValid(['name' => '']) , false);
		$this->assertEquals($input->isValid(['name' => 'kiwi']) , false);
		$this->assertEquals($input->isValid(['name' => 'kiwi@yolo.fr']) , false);
		$this->assertEquals($input->isValid(['name' => 'google.fr']) , false);
		$this->assertEquals($input->isValid(['name' => 'www.google.fr']) , false);

		// Test true
		$this->assertTrue($input->isValid(['name' => 'http://yolo.google.com']));
		$this->assertTrue($input->isValid(['name' => 'https://yolo.google.com']));
		$this->assertTrue($input->isValid(['name' => 'http://www.google.com']));
		$this->assertTrue($input->isValid(['name' => 'https://www.google.com']));
	}

}
