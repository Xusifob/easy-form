<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="row option-select" id="option-selectfieldId-fieldSubId">
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" id="field[fieldId][form-select-option-name][fieldSubId]" name="field[fieldId][form-select-option][fieldSubId][name]" placeholder="<?php _e('Nom de l\'option', 'easy-form'); ?>" value="OptionName" class="form-control" required/>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="form-group">
            <input type="text" id="field[fieldId][form-select-option-name][fieldSubId]" name="field[fieldId][form-select-option][fieldSubId][value]" placeholder="<?php _e("Valeur de l'option", 'easy-form'); ?>" value="OptionValue" class="form-control" required/>
        </div>
    </div>
    <div class="col-sm-3">
        <input type="radio" id="field[fieldId][form-select-option-selected][fieldSubId]" name="field[fieldId][form-select-option-selected]" value="1" OptionSelected class="form-control" required/>
        <label for="field[fieldId][form-select-option-selected][fieldSubId]" class="label-checkbox"><?php _e('Ce champ est séléctionné', 'easy-form'); ?></label>
    </div>
    <div class="col-sm-1">
        <a href="#" data-field="fieldId" data-option="fieldSubId" class="upanddown removeoption">×</a>
    </div>
</div>
