<?php

class EF_Submit_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_Submit_Input();

		$this->assertEquals('submit' , $input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_getLabel()
	{
		$input = new EF_Submit_Input();

		$this->assertEquals($input->getLabel(), '');
	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_Submit_Input();

		$this->assertTrue($input->isValid([]));


	}

}
