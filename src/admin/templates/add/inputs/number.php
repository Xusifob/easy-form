<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][attributes][min]"><?php _e('Value minimum', 'easy-form'); ?></label>
		<input type="number" id="field[fieldId][attributes][min]" name="field[fieldId][attributes][min]" class="form-control" placeholder="<?php _e('Value Minimum','easy-form'); ?>"/>
	</div>
	<div class="ef-input">
		<label for="field[fieldId][attributes][max]"><?php _e('Value maximum', 'easy-form'); ?></label>
		<input type="number" id="field[fieldId][attributes][min]" name="field[fieldId][attributes][max]" class="form-control" placeholder="<?php _e('Value Maximum','easy-form'); ?>"/>
	</div>
<?php
$validations = ob_get_clean();

echo str_replace('<!-- Validations -->',$validations,$data);