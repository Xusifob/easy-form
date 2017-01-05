<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId]attributes[MAX_FILE_SIZE]"><?php _e('Max upload size', EF_get_domain()); ?></label>
		<input type="number" id="field[fieldId]attributes[MAX_FILE_SIZE]" name="field[fieldId]attributes[MAX_FILE_SIZE]" class="form-control" placeholder="<?php _e('Max Upload Size',EF_get_domain()); ?>"/>
	</div>
	<div class="ef-input">
		<label for="field[fieldId]settings[allowed]"><?php _e('Allowed extensions', EF_get_domain()); ?></label>
		<input type="number" id="field[fieldId]settings[allowed]" name="field[fieldId]settings[allowed]" class="form-control" placeholder="<?php _e('png,jpg,gif,pdf',EF_get_domain()); ?>"/>
	</div>
<?php
$validations = ob_get_clean();

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId]attributes[multiple]" class="label-checkbox">
			<input type="checkbox" id="field[fieldId]attributes[multiple]" name="field[fieldId]attributes[multiple]" value="1" />
			<?php _e('Upload Multiple', EF_get_domain()); ?>
		</label>
	</div>
<?php
$values = ob_get_clean();

$data =  str_replace('<!-- Validations -->',$validations,$data);
$data =  str_replace('<!-- Values -->',$values,$data);


echo $data;