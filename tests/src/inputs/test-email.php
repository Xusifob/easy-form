<?php

class EF_Email_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_Email_Input();

		$this->assertEquals('email',$input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_Email_Input(null,['name'=> 'name']);


		$this->assertTrue($input->isValid(['name' => 'kiwi@bonbon.com']));
		$this->assertEquals($input->isValid(['name' => '']) , false);
		$this->assertEquals($input->isValid(['name' => 'kiwi']) , false);
		$this->assertEquals($input->isValid(['name' => 'kiwi@yolo']) , false);
	}

}
