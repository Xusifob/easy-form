<?php

class EF_Password_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is correctly instanced
	 */
	function test__construct()
	{
		$input = new EF_Password_Input();

		$this->assertEquals('password',$input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_Password_Input(null,['name'=> 'name']);

		$this->assertTrue($input->isValid(['name' => 'abcabcabc']));

		$input->addSetting('min-strength',EF_Password_Input::MEDIUM);
		$this->assertFalse($input->isValid(['name' => 'aaaaaaaa']));
		$this->assertTrue($input->isValid(['name' => 'Adefdyrytr']));

		$input->addSetting('min-strength',EF_Password_Input::STRONG);
		$this->assertFalse($input->isValid(['name' => 'Adefdyrytr']));
		$this->assertTrue($input->isValid(['name' => '#Adefdyrytr']));
		$input->addSetting('min-strength',EF_Password_Input::VERY_STRONG);
		$this->assertFalse($input->isValid(['name' => '#Adefdyrytr']));
		$this->assertTrue($input->isValid(['name' => '#Adefdyr6yIr8']));
	}

}
