<?php

class EF_Checkbox_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is correctly instanced
	 */
	function test__construct()
	{
		$input = new EF_Checkbox_Input();

		$this->assertEquals('checkbox' , $input->getType());
	}
}
