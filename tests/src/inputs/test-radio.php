<?php

class EF_Radio_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is correctly instanced
	 */
	function test__construct()
	{
		$input = new EF_Radio_Input();

		$this->assertEquals('radio' , $input->getType());
	}
}
