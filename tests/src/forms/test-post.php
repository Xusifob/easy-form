<?php

class EF_Post_Form_Test extends WP_UnitTestCase
{


	/**
	 *
	 * @since 1.0.0
	 *
	 * Test the login
	 */
	function test_create()
	{
		$form = new EF_Post_Form();
		$form->addSetting('post_type','test');
		$form->addSetting('post_status','draft');

		$data = [
				'title' => 'lorem ipsum',
				'content' => 'content',
		];

		$the_post_id = $form->create($data);

		$this->assertNotFalse($the_post_id);


		/** @var WP_Post $the_post */
		$the_post = $this->get_last_post();

		// The post is creates correctly
		$this->assertEquals($the_post_id,$the_post->ID);
		$this->assertEquals($the_post->post_title,'lorem ipsum');
		$this->assertEquals($the_post->post_type,'test');
		$this->assertEquals($the_post->post_status,'draft');

	}


	/**
	 * @return WP_Post
	 */
	protected function get_last_post()
	{
		$query_args = array(
				"posts_per_page" => 1,
				"orderby" => "modified",
				"order" => "DESC",
				'post_type' => 'test',
				'post_status' => 'all'
		);
		$query = new WP_Query($query_args);
		return $query->get_posts()[0];
	}

	/**
	 * @since 1.0.0
	 *
	 * Test the submit function
	 *
	 */
	function test_update()
	{
		$post_id = wp_insert_post([
				'post_title' => 'title',
				'post_content' => 'content',
		]);

		$form = new EF_Post_Form();

		$form->addSetting('post_type','test');
		$form->addSetting('post_status','draft');
		$form->addSetting('id',$post_id);

		$form->update([ 'title' => 'kiwi']);

		$the_post = $this->get_last_post();

		// The post is creates correctly
		$this->assertEquals($post_id,$the_post->ID);
		$this->assertEquals('kiwi',$the_post->post_title);
		$this->assertEquals('content',$the_post->post_content);

		$form->update([ 'content' => 'new content']);

		$the_post = $this->get_last_post();
		$this->assertEquals('kiwi',$the_post->post_title);
		$this->assertEquals('new content',$the_post->post_content);

	}

	/**
	 * @since 1.0.0
	 *
	 * Test the subimt of the form
	 */
	function test_submit()
	{
		$form = new EF_Post_Form();

		$data = [
			'_nonce' => $form->getInput('_nonce')->getValue(),
			'_time' => $form->getInput('_time')->getValue() -1,
		];
		$this->assertFalse($form->submit($data));
		$this->assertEquals('The form need a field title',$form->getError());
		$form->setError(false);

		$title = new EF_Input(null,['name' => 'title']);
		$form->addInput($title);

		$this->assertFalse($form->submit($data));
		$this->assertEquals('One or more field is missing',$form->getError());
		$form->setError(false);

		$data['title'] = 'the title';

		$this->assertTrue($form->submit($data));

		$this->assertTrue($form->hasBeenSend());


	}

}
