<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<div class="options-fieldId" style="display: none;">
    <div class="row">
        <div class="col-sm-12">
            <label>Options</label>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-4">
            <input type="text" name="field[fieldId][form-container]" class="form-control" value="div"
                   placeholder="<?php _e('Type du container', 'easy-form'); ?>"/>
        </div>
        <div class="col-md-4">
            <input type="text" name="field[fieldId][form-container-class]" data-field="fieldId" class="form-control"
                   placeholder="<?php _e('Class du container', 'easy-form'); ?>"/>
        </div>
        <div class="col-md-4">
            <input type="text" name="field[fieldId][form-container-id]" class="form-control"
                   placeholder="<?php _e('id du container', 'easy-form'); ?>"/>
        </div>
    </div>
</div>