<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- Values Group -->.+<!-- \/Values Group -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);



ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][attributes][MAX_FILE_SIZE]"><?php _e('Max upload size (in MB)', 'easy-form'); ?></label>
		<input type="number" id="field[fieldId][attributes][MAX_FILE_SIZE]" name="field[fieldId][attributes][MAX_FILE_SIZE]" class="form-control" placeholder="<?php _e('Max Upload Size','easy-form'); ?>"/>
	</div>
	<div class="ef-input">
		<label for="field[fieldId][settings][allowed]"><?php _e('Allowed extensions', 'easy-form'); ?></label>
		<input type="text" id="field[fieldId]settings[allowed]" name="field[fieldId][settings][allowed]" class="form-control" placeholder="<?php _e('png,jpg,gif,pdf','easy-form'); ?>"/>
	</div>
    <div class="ef-input">
        <label for="field[fieldId][attributes][multiple]" class="label-checkbox">
            <input type="checkbox" id="field[fieldId][attributes][multiple]" name="field[fieldId][attributes][multiple]" value="1" />
            <?php _e('Upload Multiple', 'easy-form'); ?>
        </label>
    </div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Validations -->',$validations,$data);


echo $data;