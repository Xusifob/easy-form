<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

$inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden','file','textarea','taxonomy','wp_editor','open container','close container', 'close all container',
];
?>
<div class="options-fieldId" style="display: none;">
    <div class="row">
        <div class="col-sm-12">
            <label>Options</label>
        </div>
    </div>
    <div class="row form-group">
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
                <input type="text" name="field[fieldId][form-label]" class="form-control" value="field-label" placeholder="<?php _e('Label', 'easy-form'); ?>"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label-class]" class="form-control" value="field-clas-label" placeholder="<?php _e('Class du label', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" value="1" field-required-selected/> <label for="field[fieldId][form-required]" class="label-checkbox"> <?php _e('Required', 'easy-form'); ?></label>
            </div>
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-label-after]" name="field[fieldId][form-label-after]" value="1"/> <label for="field[fieldId][form-label-after]" class="label-checkbox"><?php _e('Placer le label après le champ', 'easy-form'); ?></label>
            </div>
        </div>
    </div>
    <label for="form-order-by"><?php _e('Trier les champs par', 'easy-form'); ?></label>
    <div class="row form-group">
        <div class="col-sm-4">
            <select name="field[fieldId][form-order-by]" id="field[fieldId][form-order-by]" class="form-control">
                <option value="default"><?php _e('Défaut', 'easy-form'); ?></option>
                <option value="croissant"><?php _e('Croissant', 'easy-form'); ?></option>
                <option value="décroissant"><?php _e('Décroissant', 'easy-form'); ?></option>
            </select>
        </div>
    </div>
    <label><?php _e('Options du select', 'easy-form'); ?></label>
    optionsFields
    <button class="button button-primary button-large left" data-action="add-option" data-field="fieldId" type="button"><?php _e('Ajouter une option', 'easy-form'); ?></button>
    <hr>
</div>
