<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="options-fieldId" style="display: none;">
    <div class="row">
        <div class="col-sm-12">
            <label>Options</label>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-id]" class="form-control" value="field-id" placeholder="<?php _e('Id du champ', 'easy-form'); ?>"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-class]" class="form-control" value="field-class" placeholder="<?php _e('Class du champ', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-placeholder]" class="form-control" value="field-placeholder" placeholder="<?php _e('Placeholder du champ', 'easy-form'); ?>"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-value]" class="form-control" value="field-value" placeholder="<?php _e('Valeur du champ', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label]" class="form-control" value="field-label" placeholder="<?php _e('Label', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label-class]" class="form-control" value="field-clas-label" placeholder="<?php _e('Class du label', 'easy-form'); ?>"/>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" field-required-selected value="1" /> <label for="field[fieldId][form-required]" class="label-checkbox"> <?php _e('Required', 'easy-form'); ?></label>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-autocomplete]" name="field[fieldId][form-autocomplete]" value="1" /> <label for="field[fieldId][form-autocomplete]" class="label-checkbox"> <?php _e('Autocomplete', 'easy-form'); ?></label>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-label-after]" name="field[fieldId][form-label-after]" field-label-after-selected value="1"/> <label for="field[fieldId][form-label-after]" class="label-checkbox"><?php _e('Placer le label après le champ', 'easy-form'); ?></label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-sort-stats]" name="field[fieldId][form-sort-stats]" field-sort-stats-selected value="1"/> <label for="field[fieldId][form-sort-stats]" class="label-checkbox"><?php _e('Trier les statistiques avec ce champ', 'easy-form'); ?></label>
            </div>
        </div>
    </div>
</div>
