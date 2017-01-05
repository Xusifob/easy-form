<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId]settings[password-equals]" class="label-checkbox">
			<input type="checkbox" id="field[fieldId]settings[password-equals]" name="field[fieldId]settings[password-equals]" value="1" />
			<?php _e('All password must be equals', EF_get_domain()); ?>
		</label>
	</div>
<?php
$validations = ob_get_clean();

$data = str_replace('<!-- Validations -->',$validations,$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- Statistics Group -->.+<!-- \/Statistics Group -->/sm','',$data);

echo $data;