<?php

class EF_Select_Test extends WP_UnitTestCase
{

    /**
     * @since 1.0.0
     *
     * Test that the input is correctly instanced
     */
    function test__construct()
    {
        $input = new EF_Select();

        $this->assertEquals('select' , $input->getType());
        $this->assertEquals('select' , $input->getElement());
    }


    /**
     * @since 1.0.0
     *
     * Test that the select handles the options
     */
    function test_options()
    {
        $input = new EF_Select();
        $input->getLabel();
        $this->assertEquals($input->getOptions(),[]);
        $input->addOption(['value' => 'kiwi','selected' => true,'content' => 'yolo']);
        $this->assertEquals($input->getOptions(),[['value' => 'kiwi','selected' => true,'content' => 'yolo']]);
        $this->assertEquals('<select required="1" ><option value="kiwi"  selected="1" >yolo</option></select>',$input->__toString());

    }


    /**
     * @since 1.0.0
     *
     * Test if the input check correctly valid data
     */
    public function test__toString()
    {
        $input = new EF_Select();

        $input->getLabel();
        $this->assertEquals($input->__toString(), '<select required="1" ></select>');

    }
}
