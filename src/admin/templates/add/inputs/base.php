<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

$inputs = [
    'checkbox',
    'editor',
    'email',
    'file',
    'hidden',
    'text',
    'number',
    'password',
    'tel',
    'radio',
    'select',
    'textarea',
    'url',
    //'date','range', 'color', 'search', 'taxonomy',
];
?>
<div class="ef-field" id="field-fieldId">
    <div class="ef-field--header">
        <div class="row">
            <div class="col-sm-1">
                <div class="row">
                    <div class="col-xs-4 col-xs-offset-2 pd-0">
                        <div class="ef-input">
                            <strong class="field-number">fieldId</strong>
                        </div>
                    </div>
                    <div class="col-xs-6 pd-0 up-buttons">
                        <a href="#" class="up upanddown" data-field="fieldId">↑</a>
                        <a href="#" class="down upanddown" data-field="fieldId">↓</a>
                    </div>
                </div>
            </div>
            <div class="col-sm-5">
                <div class="ef-input">
                    <label for="field[fieldId][attributes][name]"><?php _e('Nom du champ', 'easy-form'); ?></label>
                    <input type="text" name="field[fieldId][attributes][name]" id="field[fieldId][attributes][name]" class="form-control" placeholder="<?php _e('Nom du champ', 'easy-form'); ?>" required/>
                    <a href="#" class="dupliquer" data-field="fieldId"><?php _e('Dupliquer', 'easy-form'); ?></a>
                    <a href="#" class="move" data-field="fieldId"><?php _e('Copier sur un autre formulaire', 'easy-form'); ?></a>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="ef-input">
                    <label for="field[fieldId][attributes][type]"><?php _e('Type de champ', 'easy-form'); ?></label>
                    <select name="field[fieldId][attributes][type]" class="form-control" id="field[fieldId][attributes][type]" data-field="fieldId">
                        <?php foreach($inputs as $val){ ?>
                            <option value="<?php echo str_replace(' ', '_',$val); ?>"><?php echo $val; ?></option>
                        <?php } ?>
                    </select>
                </div>
            </div>
            <div class="col-sm-1 pull-right">
                <div class="up-buttons">
                    <a href="#" data-field="fieldId" class="delete upanddown">×</a>
                    <a href="#" data-field="fieldId" class="open upanddown">+</a>
                </div>
            </div>
        </div>
    </div>
    input-content
</div>