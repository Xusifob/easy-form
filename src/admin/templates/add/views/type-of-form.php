<?php $forms = EF_get_registered_forms(); ?>
<div class="ef-content">
	<div class="spinner-container" id="spinner-utility">
		<div class="spinner"></div>
	</div>
	<table class="ef-table">
        <tr class="ef-table--separator">
            <td class="ef-rules">
                <h4><?php _e('Advanced mode','easy-form'); ?></h4>
                <p><?php _e('By enabling the advanced mode, you will display more configuration for the fields','easy-form'); ?></p>
            </td>
            <td class="ef-table-content">
                <div class="ef-input">
                    <label for="settings[advanced-mode]" class="label-checkbox">
                        <input type="checkbox" id="settings[advanced-mode]" data-action="advanced-mode" name="settings[advanced-mode]"/>
                        <?php _e('Enable advanced mode','easy-form'); ?>
                    </label>

                </div>
            </td>
        </tr>
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Type of form','easy-form'); ?></h4>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label for="settings[type]"><?php _e('Type of form', 'easy-form'); ?></label>
					<select name="settings[type]" class="form-control" id="settings[type]">
                        <?php foreach($forms as $form) { ?>
                            <option value="<?php echo $form['type']; ?>"><?php echo $form['label']; ?></option>
                        <?php } ?>
					</select>
				</div>
			</td>
		</tr>
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Specs','easy-form'); ?></h4>
				<p><?php _e('This part comport all specs linked to the type of form selected','easy-form'); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="utilities" id="utilities"></div>
			</td>
		</tr>
		<tr class="ef-table--separator">
			<td class="ef-rules">
				<h4><?php _e('Redirection','easy-form'); ?></h4>
				<p><?php _e('This part comport all information from the redirection when the form is send','easy-form'); ?></p>
			</td>
			<td class="ef-table-content">
				<div class="ef-input">
					<label
						for="settings[redirect]"><?php _e('Url or Page ID to be redirected after success (newpost for the new post page)', 'easy-form'); ?></label>
					<input name="settings[redirect]" type="text" id="settings[redirect]"
					       placeholder="<?php _e('Url or Page ID to be redirected after success (newpost for the new post page)', 'easy-form'); ?>" <?php echo isset($formMetas['form-redirect'][0]) ? 'value="' . $formMetas['form-redirect'][0] . '"' : ''; ?>
					       class="form-control"/>
				</div>

				<div class="ef-input" advanced >
					<label for="settings[parameters]"><?php _e('Url parameters', 'easy-form'); ?></label>
					<input name="settings[parameters]" type="text" id="settings[parameters]"
					       placeholder="<?php _e('key=parameter&key=parameter', 'easy-form'); ?>" class="form-control"/>
				</div>
			</td>
		</tr>

	</table>
</div>