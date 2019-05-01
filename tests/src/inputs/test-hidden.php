<?php

class EF_Hidden_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_Hidden_Input();

		$this->assertEquals('hidden', $input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_getLabel()
	{
		$input = new EF_Hidden_Input(null,['name'=> 'name']);

		$this->assertEquals($input->getLabel(), '');
	}

}
