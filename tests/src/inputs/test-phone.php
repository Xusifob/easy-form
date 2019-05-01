<?php

class EF_Phone_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_Phone_Input();

		$this->assertEquals('tel',$input->getType());

	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_Phone_Input(null,['name'=> 'name']);


		// Test false
		$this->assertEquals($input->isValid(['name' => '']),false);
		$this->assertEquals($input->isValid(['name' => 'kiwi']),false);
		$this->assertEquals($input->isValid(['name' => 'kiwi@yolo.fr']),false);

		// Test true
		$this->assertTrue($input->isValid(['name' => '+33654956669']));
		$this->assertTrue($input->isValid(['name' => '+336 54 95 66 69']));
		$this->assertTrue($input->isValid(['name' => '04 54 95 66 69']));
		$this->assertTrue($input->isValid(['name' => '04-54-95-66-69']));
		$this->assertTrue($input->isValid(['name' => '0454956669']));
		$this->assertTrue($input->isValid(['name' => '+44 4549 566690']));
		$this->assertTrue($input->isValid(['name' => '0 4549 566690']));
		//TODO check if last one is correct
	}

}
