<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');

$allposts = get_post_types();

$postDisabled = ['page','revision','attachment','nav_menu_item','acf-field','acf-field-group'];

?>
<div class="row">
    <div class="col-sm-4">
        <label for="form-send-type">Type de post</label>
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