<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
	<tr class="ef-table--separator">
		<td class="ef-rules">
			<h4><?php _e('Choices',EF_get_domain()); ?></h4>
			<p><?php _e('This part regroup all the choices possible',EF_get_domain()); ?></p>
			<p><?php _e('Display one value per line like this:',EF_get_domain()); ?></p>
			<p><?php _e('key : Value',EF_get_domain()); ?></p>
			<br>
			<p><?php _e('To select by default a value add a star on the right',EF_get_domain()); ?></p>
			<p><?php _e('key_selected : Value Selected *',EF_get_domain()); ?></p>
		</td>
		<td class="ef-table-content">
			<!-- options -->
			<div class="ef-input">
				<label for="field[fieldId]settings[options]"><?php _e('List of choices', EF_get_domain()); ?></label>
				<textarea
						id="field[fieldId]settings[options]"
						name="field[fieldId]settings[options]"
						class="form-control"
						placeholder="<?php _e("key : value \nkey : value selected *",EF_get_domain()); ?>"></textarea>
			</div>
			<!-- /options -->
			<!-- Values -->
		</td>
	</tr>
<?php
$values = ob_get_clean();

$data = preg_replace('/<!-- Values Group -->.+<!-- \/Values Group -->/sm',$values,$data);
echo $data;