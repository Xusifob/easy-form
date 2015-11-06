<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');
?>
<div class="options-fieldId" style="display: none;">
    <div class="row form-group">
        <div class="col-sm-4">
            <label for="field[fieldId][form-taxonomy]">Taxonomy</label>
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
            <label for="field[fieldId][form-taxonomy-type]">Type de champ</label>
            <select data-field="fieldId" name="field[fieldId][form-taxonomy-type]" id="field[fieldId][form-taxonomy-type]" class="form-control">
                <option value="select">Select</option>
                <option value="hidden">Hidden</option>
                <!--<option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>-->
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            <label>Options</label>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-id]" class="form-control" placeholder="Id du champ"/>
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-class]" class="form-control" placeholder="Class du champ"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-empty-field]" class="form-control" placeholder="Valeur du champ vide">
            </div>
            <div class="form-group">
                <input type="text" name="field[fieldId][form-value]" class="form-control" placeholder="Valeur du champ"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label]" class="form-control" placeholder="Label"/>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="text" name="field[fieldId][form-label-class]" class="form-control" placeholder="Class du label"/>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-required]" name="field[fieldId][form-required]" value="1" checked/> <label for="field[fieldId][form-required]" class="label-checkbox"> Required</label>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="form-group">
                <input type="checkbox" id="field[fieldId][form-label-after]" name="field[fieldId][form-label-after]" value="1"/> <label for="field[fieldId][form-label-after]" class="label-checkbox">Placer le label après le champ</label>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <input type="checkbox" id="field[fieldId][form-readonly]" name="field[fieldId][form-readonly]" value="1" /> <label for="field[fieldId][form-readonly]" class="label-checkbox"> Read only</label>
                </div>
            </div>
        </div
    </div>
</div>
