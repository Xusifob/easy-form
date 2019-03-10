<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][attributes][min]"><?php _e('Value minimum', EF_get_domain()); ?></label>
		<input type="number" id="field[fieldId][attributes][min]" name="field[fieldId][attributes][min]" class="form-control" placeholder="<?php _e('Value Minimum',EF_get_domain()); ?>"/>
	</div>
	<div class="ef-input">
		<label for="field[fieldId][attributes][max]"><?php _e('Value maximum', EF_get_domain()); ?></label>
		<input type="number" id="field[fieldId][attributes][min]" name="field[fieldId][attributes][max]" class="form-control" placeholder="<?php _e('Value Maximum',EF_get_domain()); ?>"/>
	</div>
<?php
$validations = ob_get_clean();

echo str_replace('<!-- Validations -->',$validations,$data);