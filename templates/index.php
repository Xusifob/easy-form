<div class="wrap gf_browser_chrome">
    <div class="wrap">
        <div id="icon-users" class="icon32"></div>
        <h2><?php _e('Formulaires', 'easy-form'); ?> <a class="add-new-h2" href="<?php menu_page_url('add-form'); ?>"><?php _e('Ajouter', 'easy-form'); ?></a></h2>
        <?php /** @var FormListTable $formTable */
         $formTable->display(); ?>
    </div>
</div>

<?php _e('', 'easy-form'); ?>

<?php __('','easy-form') ?>
