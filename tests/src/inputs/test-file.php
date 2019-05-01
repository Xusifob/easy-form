<?php

class EF_File_Test extends WP_UnitTestCase
{

	/**
	 * @since 1.0.0
	 *
	 * Test that the input is correctly instanced
	 */
	function test__construct()
	{
		$input = new EF_File_Input();

		$this->assertEquals('file' , $input->getType());
	}


	/**
	 * @since 1.0.0
	 *
	 * Test that the check for valid item is working
	 */
	function test_isValid()
	{
		$input = new EF_File_Input(null,['name' => 'name']);

		// Test the extension wrong
		$this->assertFalse($input->isValid(['name' => [
				'name' => 'yolo.pnf',
				'error' => UPLOAD_ERR_OK,
				'size' => 1,
		]]));

		// Test error wrong
		$this->assertFalse($input->isValid(['name' => [
				'name' => 'yolo.png',
				'error' => UPLOAD_ERR_CANT_WRITE,
				'size' => 1,
		]]));

		// Test size wrong
		$this->assertFalse($input->isValid(['name' => [
				'name' => 'yolo.png',
				'error' => UPLOAD_ERR_OK,
				'size' => 2097155,
		]]));


		$input->addAttribute('MAX_FILE_SIZE',3097155);
		$this->assertTrue($input->isValid(['name' => [
				'name' => 'yolo.png',
				'error' => UPLOAD_ERR_OK,
				'size' => 2097155,
		]]));

		$this->assertTrue($input->isValid(['name' => [
			'name' => 'yolo.png',
			'error' => UPLOAD_ERR_OK,
			'size' => 1,
		]]));
	}


	/**
	 * @since 1.0.0
	 *
	 * Test that the upload is working
	 */
	function test_upload()
	{
		$file = new EF_File_Input(null,['name' => 'test'],[],$_FILES);

		$this->assertNotFalse($file->upload(1,['action' => 'test','test_form' => false ]));

	}


	/**
	 * @since 1.0.0
	 *
	 * Test that the upload in post is working
	 */
	function test_insert_in_post()
	{
		$post_id = 1;

		$file = new EF_File_Input(null,['name' => 'test'],[],$_FILES);

		$insert = $file->insert($post_id,'post',['action' => 'test','test_form' => false ]);

		// File is correctly inserted
		$this->assertNotFalse($insert);

		$file_id = get_post_meta($post_id,'test',true);

		// File is added in the post
		$this->assertEquals($file_id,$insert);

	}

	/**
	 * @since 1.0.0
	 *
	 * Test that the upload in post is working
	 */
	function test_insert_in_user()
	{
		$user_id = 1;

		$file = new EF_File_Input(null,['name' => 'test'],[],$_FILES);

		$insert = $file->insert($user_id,'user',['action' => 'test','test_form' => false ]);

		// File is correctly inserted
		$this->assertNotFalse($insert);

		$file_id = get_user_meta($user_id,'test',true);

		// File is added in the post
		$this->assertEquals($file_id,$insert);
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

		// Create the tmp file
		$dir = __DIR__ . '/../../_files/';
		copy($dir . '_test.jpg',$dir . 'test.jpg');

		parent::setUp();

		$_FILES = array(
				'test' => array(
						'name' => 'test.jpg',
						'type' => 'image/jpg',
						'size' => 542,
						'tmp_name' => $dir . 'test.jpg',
						'error' => 0
				)
		);

	}

}
