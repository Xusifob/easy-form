<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- value -->.+<!-- \/value -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- Label after -->.+<!-- \/Label after -->/sm','',$data);

ob_start(); ?>
    <div class="ef-input">
        <label for="field[fieldId][settings][left-label]"><?php _e('Left label', 'easy-form'); ?></label>
        <input type="text" id="field[fieldId][settings][left-label]" name="field[fieldId][settings][left-label]" class="form-control" placeholder="<?php _e('Label Value','easy-form'); ?>"/>
    </div>
    <div class="ef-input">
        <label for="field[fieldId][settings][right-label]"><?php _e('Right label', 'easy-form'); ?></label>
        <input type="text" id="field[fieldId][settings][right-label]" name="field[fieldId][settings][right-label]" class="form-control" placeholder="<?php _e('Label Value','easy-form'); ?>"/>
    </div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Values -->',$validations,$data);

ob_start(); ?>
    <div class="ef-input">
        <label for="field[fieldId][settings][min-number]"><?php _e('Min note', 'easy-form'); ?></label>
        <select name="field[fieldId][settings][min-number]" class="form-control" id="field[fieldId][attributes][min--number]" data-field="fieldId">
            <?php for($i = 0; $i <= 1;$i++){ ?>
                <option value="<?php echo $i; ?>"><?php echo $i ?></option>
            <?php } ?>
        </select>
    </div>
    <div class="ef-input">
        <label for="field[fieldId][settings][max-number]"><?php _e('Max note', 'easy-form'); ?></label>
        <select name="field[fieldId][settings][max-number]" class="form-control" id="field[fieldId][attributes][max-number]" data-field="fieldId">
            <?php for($i = 1; $i <= 10;$i++){ ?>
                    <option value="<?php echo $i; ?>"><?php echo $i ?></option>
            <?php } ?>
        </select>
    </div>
<?php
$validations = ob_get_clean();
$data =  str_replace('<!-- Validations -->',$validations,$data);


echo $data;