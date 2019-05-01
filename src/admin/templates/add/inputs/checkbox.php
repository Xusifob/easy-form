<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][attributes][checked]" class="label-checkbox">
			<input type="checkbox" id="field[fieldId][attributes][checked]" name="field[fieldId][attributes][checked]" value="checked" />
			<?php _e('Checked by default', 'easy-form'); ?>
		</label>
	</div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Values -->',$validations,$data);

echo $data;