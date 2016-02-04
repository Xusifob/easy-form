<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');
?>
<div class="options-fieldId" style="display: none;">
    <div class="row form-group">
        <div class="col-sm-4">
            <label for="field[fieldId][form-taxonomy]"><?php _e('Taxonomy', 'easy-form'); ?></label>
            <select data-field="fieldId" name="field[fieldId][form-taxonomy]" id="field[fieldId][form-taxonomy]" class="form-control">
                <?php $taxonomies = get_taxonomies();
                foreach($taxonomies as $key => $taxonomy){
                    $taxonomy = get_taxonomy($taxonomy)
                    ?>
                    '<option value="<?php echo addslashes($taxonomy->name); ?>"><?php echo addslashes($taxonomy->label); ?></option>
                    <?php
                } ?>
            </select>
        </div>
        <div class="col-sm-4">
            <label for="field[fieldId][form-taxonomy-type]"><?php _e('Type de champ', 'easy-form'); ?></label>
            <select data-field="fieldId" name="field[fieldId][form-taxonomy-type]" id="field[fieldId][form-taxonomy-type]" class="form-control">
                <option value="select"><?php _e('Select', 'easy-form'); ?></option>
                <option value="hidden"><?php _e('Hidden', 'easy-form'); ?></option>
                <!--<option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>-->
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            <label><?php _e('Options', 'easy-form'); ?></label>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-id]" class="form-control" placeholder="<?php _e('Id du champ', 'easy-form'); ?>"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-class]" class="form-control" placeholder="<?php _e('Class du champ', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-empty-field]" class="form-control" placeholder="<?php _e('Valeur du champ vide', 'easy-form'); ?>">
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-value]" class="form-control" placeholder="<?php _e('Valeur du champ', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label]" class="form-control" placeholder="<?php _e('Label', 'easy-form'); ?>"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label-class]" class="form-control" placeholder="<?php _e('Class du label', 'easy-form'); ?>"/>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" value="1" checked/> <label for="field[fieldId][form-required]" class="label-checkbox"> <?php _e('Required', 'easy-form'); ?></label>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-label-after]" name="field[fieldId][form-label-after]" value="1"/> <label for="field[fieldId][form-label-after]" class="label-checkbox"><?php _e('Placer le label après le champ', 'easy-form'); ?></label>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <input type="checkbox" id="field[fieldId][form-readonly]" name="field[fieldId][form-readonly]" value="1" /> <label for="field[fieldId][form-readonly]" class="label-checkbox"> <?php _e('Read only', 'easy-form'); ?></label>
                </div>
            </div>
        </div
    </div>
</div>
