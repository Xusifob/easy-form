<?php

class EF_TextArea_Test extends WP_UnitTestCase
{

    /**
     * @since 1.0.0
     *
     * Test that the input is corectly instanced
     */
    function test__construct()
    {
        $input = new EF_TextArea();

        $this->assertEquals('textarea' , $input->getType());
        $this->assertEquals('textarea' , $input->getElement());

    }

    /**
     * @since 1.0.0
     *
     * Test if the input check correctly valid data
     */
    public function test__toString()
    {
        $input = new EF_TextArea();

        $input->getLabel();
        $this->assertEquals($input->__toString(), '<textarea required="1" ></textarea>');

    }
}
