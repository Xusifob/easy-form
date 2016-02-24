<?php
$allposts = get_post_types();

$postDisabled = ['page','revision','attachment','nav_menu_item','acf-field','acf-field-group'];

?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="row">
    <div class="col-sm-4">
        <label for="form-send-type"><?php _e('Type de post', 'easy-form'); ?></label>
        <select name="form-send-type" class="form-control" id="form-send-type">
            <?php
            foreach ($allposts as $allpost){
                if(!in_array($allpost,$postDisabled)){ ?>
                    <option value="<?php echo $allpost; ?>"><?php echo $allpost; ?></option>
                <?php } } ?>
        </select>
    </div>
    <div class="col-sm-4">
        <label for="form-send-staut">Statut</label>
        <select id="form-send-staut" class="form-control" name="form-send-staut">
            <?php $post_status = get_post_stati();
            foreach($post_status as $post_statut){ ?>
                <option value="<?php echo $post_statut; ?>"><?php echo $post_statut; ?></option>
            <?php } ?>
        </select>
    </div>
</div>