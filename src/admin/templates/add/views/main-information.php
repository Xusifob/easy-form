<div class="ef-content">
	<table class="ef-table">
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('HTML Elements',EF_get_domain()); ?></h4>
				<p><?php _e('This part will regroup all the information linked to the &lt;form&gt; html element',EF_get_domain()); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="attributes[class]"><?php _e('Class of the form', EF_get_domain()); ?></label>
					<input type="text" id="attributes[class]"
					       name="attributes[class]" class="form-control"
					       placeholder="<?php _e('Class of the form', EF_get_domain()); ?>"/>
				</div>


				<div class="ef-input">
					<label for="attributes[id]"><?php _e('Id of the form', EF_get_domain()); ?></label>
					<input type="text" class="form-control" id="attributes[id]"
					       name="attributes[id]" placeholder="<?php _e('Id of the form', EF_get_domain()); ?>"/>
				</div>

				<div class="ef-input">
					<label for="attributes[action]"><?php _ex('Action','Action of the form',EF_get_domain()); ?></label>
					<input type="text"
					       class="form-control"
					       id="attributes[action]"
					       name="attributes[action]"
					       placeholder="<?php _e('Action of the form', EF_get_domain()); ?>"/>
				</div>
			</td>
		</tr>

		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Field options',EF_get_domain()); ?></h4>
				<p><?php _e('This part will regroup all the information repeated on all fields',EF_get_domain()); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="settings[default-class]"><?php _e('Default Class', EF_get_domain()); ?></label>
					<input type="text"
					       id="settings[default-class]"
					       name="settings[default-class]"
					       class="form-control"
					       placeholder="<?php _e('Field\'s default class', EF_get_domain()); ?>"/>
				</div>
			</td>
		</tr>

		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Errors',EF_get_domain()); ?></h4>
				<p><?php _e('This part will regroup  how the errors will be handled in the form',EF_get_domain()); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="settings[display-errors]" class="label-checkbox">
						<input type="checkbox" id="settings[display-errors]" name="settings[display-errors]"/>
						<?php _e('Display the errors of every field', EF_get_domain()); ?>
					</label>
				</div>
				<div class="ef-input">
					<label for="settings[errors-before]" class="label-checkbox">
						<input type="checkbox" id="settings[errors-before]" name="settings[errors-before]"/>
						<?php _e('Display errors over the field',EF_get_domain()); ?>
					</label>

				</div>
			</td>
		</tr>

	</table>
</div>
