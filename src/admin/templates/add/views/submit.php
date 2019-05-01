<div class="ef-content">
	<table class="ef-table">
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Submit Information','easy-form'); ?></h4>
				<p><?php _e('This part regroup all informations of the submit button','easy-form'); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="form-button-send"><?php _e('Send Value', 'easy-form'); ?></label>
					<input type="text"
					       class="form-control" id="field[submit][attributes][value]" name="field[submit][attributes][value]"
					       placeholder="<?php _e('Send Value', 'easy-form'); ?>"/>
				</div>
				<div class="ef-input">
					<label for="field[submit][attributes][class]"><?php _e('Input Class', 'easy-form'); ?></label>
					<input type="text" class="form-control" id="field[submit][attributes][class]"
					       name="field[submit][attributes][class]"
					       placeholder="<?php _e('Class', 'easy-form'); ?>"/>
				</div>

				<input type="hidden" name="field[submit][attributes][name]" value="submit">
				<input type="hidden" name="field[submit][attributes][type]" value="submit">

				<div class="ef-input">
					<label for="field[submit][attributes][id]"><?php _e('Input Id', 'easy-form'); ?></label>
					<input type="text" class="form-control" id="field[submit][attributes][id]"
					       name="field[submit][attributes][id]"
					       placeholder="<?php _e('Id', 'easy-form'); ?>"/>
				</div>
			</td>
		</tr>
	</table>
</div>