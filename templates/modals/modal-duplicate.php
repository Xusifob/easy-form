<?php
// Getting all forms
$args = [
    'post_type' => 'form-plugin-bastien',
    'posts_per_page' => -1,
];

$my_query = new WP_Query($args);
?>
<div class="modal fade bs-example-modal-sm" tabindex="-1" id="modal-move" role="dialog" aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <form action="<?php echo $_SERVER['REQUEST_URI'];?>&noheader=true" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Dupliquer un champ sur un autre formulaire</h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="form-duplicate-field-id"/>
                    <label for="form-duplicate-form">Nom du nouveau formulaire</label>
                    <select name="form-duplicate-form" id="form-duplicate-form">
                        <?php while($my_query->have_posts()): $my_query->the_post(); ?>
                            <option value="<?php the_ID() ?>"><?php the_title(); ?></option>
                        <?php endwhile; ?>
                    </select>
                    <input type="hidden" name="form-duplicate-field-id" id="form-duplicate-field-id">
                    <?php
                    // If it's a modification, i put the id in a hidden field
                    if(isset($form)):
                        ?>
                        <input type="hidden" name="form-id" value="<?php echo $form->ID; ?>">
                    <?php endif; ?>
                    <input type="hidden" name="wp_nonce" value="<?php echo wp_create_nonce('duplicate_field'); ?>">
                    <input type="hidden" name="action" value="duplicate_field">
                </div>
                <div class="modal-footer">
                    <input type="submit" value="Copier" class="button button-primary button-large left"/>
                </div>
            </form>
        </div>
    </div>
</div>
