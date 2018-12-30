<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
    <div class="ef-input">
        <label for="field[fieldId][settings][password-equals]" class="label-checkbox">
            <input type="checkbox" id="field[fieldId][settings][password-equals]" name="field[fieldId][settings][password-equals]" value="1" />
            <?php _e('All password fields must be equals', EF_get_domain()); ?>
        </label>
    </div>
    <div class="ef-input">
        <label for="field[fieldId][settings][min-strength]"><?php _e('Password minimal strength', EF_get_domain()); ?></label>
        <select class="form-control" name="field[fieldId][settings][min-strength]" id="field[fieldId][settings][min-strength]">
            <option value="<?php echo EF_Password_Input::VERY_WEAK; ?>"><?php _e('No verification',EF_get_domain()); ?></option>
            <option value="<?php echo EF_Password_Input::WEAK; ?>"><?php _e('Weak',EF_get_domain()); ?></option>
            <option value="<?php echo EF_Password_Input::MEDIUM; ?>"><?php _e('Medium',EF_get_domain()); ?></option>
            <option value="<?php echo EF_Password_Input::STRONG; ?>"><?php _e('Strong',EF_get_domain()); ?></option>
            <option value="<?php echo EF_Password_Input::VERY_STRONG; ?>"><?php _e('Very Strong',EF_get_domain()); ?></option>
        </select>
    </div>
<?php
$validations = ob_get_clean();

$data = str_replace('<!-- Validations -->',$validations,$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- Statistics Group -->.+<!-- \/Statistics Group -->/sm','',$data);

echo $data;