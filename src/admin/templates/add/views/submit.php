<div class="ef-content">
	<table class="ef-table">
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Submit Information',EF_get_domain()); ?></h4>
				<p><?php _e('This part regroup all informations of the submit button',EF_get_domain()); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="form-button-send"><?php _e('Send Value', EF_get_domain()); ?></label>
					<input type="text"
					       class="form-control" id="field[submit][attributes][value]" name="field[submit][attributes][value]"
					       placeholder="<?php _e('Send Value', EF_get_domain()); ?>"/>
				</div>
				<div class="ef-input">
					<label for="field[submit][attributes][class]"><?php _e('Input Class', EF_get_domain()); ?></label>
					<input type="text" class="form-control" id="field[submit][attributes][class]"
					       name="field[submit][attributes][class]"
					       placeholder="<?php _e('Class', EF_get_domain()); ?>"/>
				</div>

				<input type="hidden" name="field[submit][attributes][name]" value="submit">
				<input type="hidden" name="field[submit][attributes][name]" value="submit">

				<div class="ef-input">
					<label for="field[submit][attributes][id]"><?php _e('Input Id', EF_get_domain()); ?></label>
					<input type="text" class="form-control" id="field[submit][attributes][id]"
					       name="field[submit][attributes][id]"
					       placeholder="<?php _e('Id', EF_get_domain()); ?>"/>
				</div>
			</td>
		</tr>
	</table>
</div>