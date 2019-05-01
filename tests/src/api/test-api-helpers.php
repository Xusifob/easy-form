<?php

class EF_API_Helpers_Test extends WP_UnitTestCase
{
	/**
	 * Test if the EF_get_setting function woks
	 */
	function test_EF_get_setting()
	{
		$this->assertEquals(EF_get_setting('test'),'test');
	}


	/**
	 * Test if the union is correct according to the link
	 */
	function test_EF_get_link_union()
	{
		$this->assertEquals(EF_get_link_union('?'), '&');
		$this->assertEquals(EF_get_link_union('yolo'),'?');
		$this->assertEquals(EF_get_link_union('http://example.com#kiwi'),'?');
		$this->assertEquals(EF_get_link_union('http://example.com#kiwi?echo=bonbon'), '&');
	}


	/**
	 * Test if arrays are flattened correctly
	 */
	function test_array_flatten()
	{
		$array = [
				[
						'name' => 'kiwi'
				],
				'bonbon' => [
						'banana' => 'kiwi'
				],
				3
		];

		$expected = Array (
				'0_name' => 'kiwi',
				'bonbon_banana' => 'kiwi',
				1 => 3,
		);

		$this->assertEquals($expected,array_flatten($array));
	}
}
