<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$taxs = get_taxonomies(array('public' => true),'objects');

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- value -->.+<!-- \/value -->/sm','',$data);

ob_start(); ?>
    <div class="ef-input">
        <label for="field[fieldId][settings][taxonomy]"><?php _e('Taxonomy used',EF_get_domain()); ?></label>

        <select name="field[fieldId][settings][taxonomy]" id="field[fieldId][settings][taxonomy]" class="form-control">
            <?php foreach($taxs as $tax) { ?>
                <option value="<?php echo $tax->name; ?>"><?php echo $tax->label; ?></option>
            <?php } ?>
        </select>
    </div>
    <div class="ef-input">
        <label for="field[fieldId][settings][multiple]" class="label-checkbox">
            <input type="checkbox" id="field[fieldId][settings][multiple]" name="field[fieldId][settings][multiple]" value="checked" />
            <?php _e('Allow multiple entries', EF_get_domain()); ?>
        </label>
    </div>
    <div class="ef-input">
        <label for="field[fieldId][settings][add-to-taxonomy]" class="label-checkbox">
            <input type="checkbox" id="field[fieldId][settings][add-to-taxonomy]" name="field[fieldId][settings][add-to-taxonomy]" value="checked" />
            <?php _e('Add the post to the taxonomy', EF_get_domain()); ?>
        </label>
        <p class="small-help"><?php _e('If unselected, the data of the taxonomy will be added as a post meta',EF_get_domain()); ?></p>
    </div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Values -->',$validations,$data);

echo $data;