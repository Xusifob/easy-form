<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- Values Group -->.+<!-- \/Values Group -->/sm','',$data);
$data = preg_replace('/<!-- HTML Elements -->.+<!-- \/HTML Elements -->/sm','',$data);
$data = preg_replace('/<!-- Required -->.+<!-- \/Required -->/sm','',$data);
$data = preg_replace('/<!-- Statistics Group -->.+<!-- \/Statistics Group -->/sm','',$data);

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][settings][api_key]"><?php _e('Website Re Captcha API Key', EF_get_domain()); ?></label>
        <input type="text" id="field[fieldId][settings][api_key]" placeholder="6Lcmqo4UAAAAABs4Cyq4I_xLDLhB_f4PuNEOd9KW" class="form-control" name="field[fieldId][settings][api_key]" />
    </div>
    <div class="ef-input">
		<label for="field[fieldId][settings][api_key_secret]"><?php _e('Secret Re Captcha API Key', EF_get_domain()); ?></label>
        <input type="text" id="field[fieldId][settings][api_key_secret]" placeholder="6Lcmqo4UAAAAABs4Cyq4I_xLDLhB_f4PuNEOd9KW" class="form-control" name="field[fieldId][settings][api_key_secret]" />
        <p class="small-help"><?php _e('The api keys can be retrieved here : <a href="https://g.co/recaptcha/v3" target="_blank">https://g.co/recaptcha/v3</a>',EF_get_domain()); ?></p>
    </div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Validations -->',$validations,$data);

echo $data;