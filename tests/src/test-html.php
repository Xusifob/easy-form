<?php

class EF_Html_Element_Test extends WP_UnitTestCase
{


    /**
     * @since 1.0.0
     *
     * Test that the attributes are working correctly
     */
    function test_attribute() {

        $html = new EF_Html_Element(['bonbon' => 'opium']);

        // If the attribute does not exist, return false
        $this->assertEquals( $html->getAttribute('kiwi'),false );
        $this->assertEquals( $html->getAttribute('bonbon'),'opium' );

        $html->addAttribute('kiwi','banane');

        $this->assertEquals( $html->getAttribute('kiwi'),'banane' );
        $this->assertEquals( $html->getAttributes(),['kiwi' => 'banane','bonbon' => 'opium']);

        $this->assertEquals( $html->__toString(),'< bonbon="opium"  kiwi="banane" ></>' );

        $html->removeAttribute('kiwi');

        $this->assertEquals( $html->getAttributes(), ['bonbon' => 'opium']);


    }


    /**
     * @since 1.0.0
     *
     * Test that the element is correctly inserted in the html code
     */
    function test_element() {

        $html = new EF_Html_Element();

        // If the attribute does not exist, return false
        $html->setElement('kiwi');

        $this->assertEquals( $html->__toString() ,'<kiwi></kiwi>' );

    }


    /**
     *
     */
    function test_jsonSerialize()
    {
        $html = new EF_Html_Element(['kiwi' => 'banane']);

        $this->assertEquals( $html->jsonSerialize(),['attributes' => ['kiwi' => 'banane'],'element' => '']);
    }
}