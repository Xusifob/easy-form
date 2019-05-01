<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<tr class="ef-table--separator">
		<td class="ef-rules">
			<h4><?php _e('Choices','easy-form'); ?></h4>
			<p><?php _e('This part regroup all the choices possible','easy-form'); ?></p>
			<p><?php _e('Display one value per line like this:','easy-form'); ?></p>
			<p><?php _e('key : Value','easy-form'); ?></p>
			<br>
			<p><?php _e('To select by default a value add a star on the right','easy-form'); ?></p>
			<p><?php _e('key_selected : Value Selected *','easy-form'); ?></p>
		</td>
		<td class="ef-table-content">
			<!-- options -->
			<div class="ef-input">
				<label for="field[fieldId][settings][options]"><?php _e('List of choices', 'easy-form'); ?></label>
				<textarea
						id="field[fieldId][settings][options]"
						name="field[fieldId][settings][options]"
						class="form-control"
						placeholder="<?php _e("key : value \nkey : value selected *",'easy-form'); ?>"></textarea>
			</div>
			<!-- /options -->
			<!-- Values -->
		</td>
	</tr>
<?php
$values = ob_get_clean();

$data = preg_replace('/<!-- Values Group -->.+<!-- \/Values Group -->/sm',$values,$data);
echo $data;