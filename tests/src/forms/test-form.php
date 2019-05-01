<?php

class EF_Form_Test extends WP_UnitTestCase
{

	/**
	 * @var EF_Form
	 */
	protected $_object;


	/**
	 * @since 1.0.0
	 *
	 * Test that the class is instanced correctly
	 */
	function test__construct()
	{
		$form = $this->_object;

		// Uniq id works
		$this->assertNotNull($form->getUniqId());

		// It can combine the attributes
		$this->assertEquals('test',$form->getSetting('test'));

		// It can create the default inputs
		$this->assertInstanceOf('EF_Hidden_Input',$form->getInput('_nonce'));
		$this->assertInstanceOf('EF_Hidden_Input',$form->getInput('_time'));
		$this->assertInstanceOf('EF_Input',$form->getInput('_antispam'));

	}

	/**
	 * @since 1.0.0
	 *
	 * Test that the form handle the inputs correctly
	 */
	function test_Inputs()
	{
		$form = $this->_object;

		$input = new EF_Input(null,['name' => 'bonbon']);
		$form->addInput($input);

		$new_input = $form->getInput('bonbon');
		$this->assertEquals($input,$new_input);
		$this->assertTrue($form->hasInput('bonbon'));

		$form->removeInput('bonbon');
		$this->assertFalse($form->getInput('bonbon'));
		$this->assertFalse($form->hasInput('bonbon'));

		$form = $this->cleanForm($form);

		$this->assertEquals([],$form->getInputs());

		$form->addInput($input);
		$this->assertEquals(['bonbon' => $input],$form->getInputs());

		$multiple = new EF_Input(null,['name' => 'kiwi[]']);
		$form->addInput($multiple);

		$this->assertEquals(['bonbon' => $input,'kiwi[]' => [$multiple]],$form->getInputs());
		$this->assertEquals(['bonbon' => $input,'kiwi[]_0' => $multiple],$form->getInputs(true));

	}


	public function test__toString()
	{
		$form = $this->_object;
		$form = $this->cleanForm($form);

		// Handle displaying the empty form
		$this->assertEquals('<form method="POST"  enctype="multipart/form-data"  action=""  name="form"  novalidate="1" ></form>',$form->__toString());

		$input = new EF_Input(null,['name' => 'name','id' => 'id']);

		// Handle displaying
		$form->addInput($input);
		$this->assertEquals(
				'<form method="POST"  enctype="multipart/form-data"  action=""  name="form"  novalidate="1" >
<label for="id"  class="sr-only" >name</label><input required="1"  type="text"  name="name"  id="id" >
</form>',
				$form->__toString());
		$form->removeInput($input->getName());



		// Handle inputs multiple
		$input = new EF_Input(null,['name' => 'name[]','id' => 'id']);
		$form->addInput($input);

		$input = new EF_Input(null,['name' => 'name[]','id' => 'id-2']);
		$form->addInput($input);

		$this->assertEquals(
				'<form method="POST"  enctype="multipart/form-data"  action=""  name="form"  novalidate="1" >
<label for="id"  class="sr-only" >name[]</label><input required="1"  type="text"  name="name[]"  id="id" >

<label for="id-2"  class="sr-only" >name[]</label><input required="1"  type="text"  name="name[]"  id="id-2" >
</form>',
				$form->__toString());

	}

	function test_()
	{

	}


	/**
	 * @since 1.0.0
	 *
	 * Remove the predefined fields
	 *
	 * @param EF_Form $form
	 *
	 * @return EF_Form
	 */
	protected function cleanForm(EF_Form $form){

		$form->removeInput('_time');
		$form->removeInput('_nonce');
		$form->removeInput('_uniqid');
		$form->removeInput('_antispam');

		return $form;
	}


	/**
	 * @since 1.0.0
	 *
	 * Test the getField
	 */
	public function test_getField()
	{
		$form = $this->_object;
		$form = $this->cleanForm($form);

		$input = new EF_Input(null,['name' => 'name']);
		$form->addInput($input);

		$this->assertEquals($input,$form->getField('name'));
		$this->assertFalse($form->getField('name'));

	}

	public function test_isValid()
	{
		$form = $this->_object;

		$data = [];

		$this->assertFalse($form->isValid($data));
		$this->assertEquals('Unrecognised Nonce',$form->getError());

		$data['_nonce'] = $form->getInput('_nonce')->getValue();

		$form->setError(false);
		$this->assertFalse($form->isValid($data));
		$this->assertEquals('Anti spam Triggered please try again',$form->getError());

		$data['_time'] = $form->getInput('_time')->getValue();
		$form->setError(false);
		$this->assertFalse($form->isValid($data));
		$this->assertEquals('Anti spam Triggered please try again',$form->getError());

		$data['_time'] = $form->getInput('_time')->getValue() -1;
		$form->setError(false);
		$this->assertTrue($form->isValid($data));

	}


	/**
	 *
	 * @since 1.0.0
	 *
	 * Sets up the fixture, for example, opens a network connection.
	 * This method is called before a test is executed.
	 */
	public function setUp()
	{
		$stub = $this->getMockForAbstractClass('EF_Form',[1,[],['test' => 'test']]);
		$this->_object = $stub;
	}

}
