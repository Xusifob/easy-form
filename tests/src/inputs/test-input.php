<?php

class EF_Input_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is corectly instanced
	 */
	function test__construct()
	{
		$input = new EF_Input();

		$this->assertEquals($input->getElement() , 'input');
		$this->assertTrue($input->getAttribute('required'));

		$input = new EF_Input(null,['required' => false]);
		$this->assertEquals($input->getAttribute('required') , false);

		$this->assertTrue($input->hasError());

		$input = new EF_Input(null,['value' => 'kiwi','name' => 'pigeon'],[],['pigeon' => 'eagle','yolo' => 'plop']);

		$this->assertEquals($input->getAttribute('value') , 'eagle');
		$this->assertEquals(false , $input->hasError());

		$this->assertEquals('text' , $input->getType());

	}


	/**
	 * @since 1.0.0
	 *
	 * Test functions linked to the settings management
	 *
	 */
	public function test_settings()
	{

		$input = new EF_Input(null,[],['kiwi' => 'banane']);

		$this->assertEquals($input->getSetting('kiwi') , 'banane');
		$this->assertEquals($input->getSetting('bonbon') , false);

		$input->addSetting('bonbon','kiwi');
		$this->assertEquals($input->getSetting('bonbon') , 'kiwi');
		$this->assertEquals($input->getSettings() , ['bonbon' => 'kiwi','kiwi' => 'banane']);

		$input->removeSetting('bonbon');
		$this->assertEquals($input->getSetting('bonbon') , false);

	}


	/**
	 * @since 1.0.0
	 *
	 * Test the __toString method
	 */
	public function test__toString()
	{
		$input = new EF_Input();

		// Remove the label from the string
		$input->getLabel();

		$this->assertEquals($input->__toString() , '<input required="1"  type="text" >');
	}


	/**
	 * @since 1.0.0
	 *
	 * Test all functions linked to the label
	 */
	public function test_label()
	{
		$input = new EF_Input(null,['id' => 'bonbon']);


		// Check getLabel
		$this->assertEquals($input->getLabel() , '<label for="bonbon"  class="sr-only" ></label>');
		$this->assertEquals($input->getLabel() , '');
		$this->assertEquals($input->getLabel(true) , '<label for="bonbon"  class="sr-only" ></label>');


		// Check __toString
		$input = new EF_Input();
		$this->assertEquals($input->__toString() , '<label for=""  class="sr-only" ></label><input required="1"  type="text" >');

		// Check settings label-after
		$input = new EF_Input(null,[],['label-after' => true]);
		$this->assertEquals($input->__toString() , '<input required="1"  type="text" ><label for=""  class="sr-only" ></label>');


		// Check settings
		$input = new EF_Input(null,[],['label' => 'orange']);
		$this->assertEquals($input->getLabel() , '<label for=""  class="" >orange</label>');


		$input = new EF_Input(null,[],['label-class' => 'kiwi']);
		$this->assertEquals($input->getLabel() , '<label for=""  class="kiwi" ></label>');
	}

	/**
	 * @since 1.0.0
	 *
	 * Test if the input check correctly valid data
	 */
	public function test_isValid()
	{
		$input = new EF_Input(null,['name'=> 'name']);

		$this->assertEquals($input->isValid(['bonbon' => 'banane']), false);

		$this->assertTrue($input->hasError());

		$this->assertTrue($input->isValid(['name' => 'kiwi']));
		$this->assertEquals($input->isValid(['name' => '']), false);

		$input = new EF_Input(null,['required'=> false]);

		$this->assertTrue($input->isValid([]));


	}

}
