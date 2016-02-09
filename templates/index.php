<div class="wrap gf_browser_chrome">
    <div class="wrap">
        <div id="icon-users" class="icon32"></div>
        <h2><?php _e('Formulaires', 'easy-form'); ?> <a class="add-new-h2" href="<?php menu_page_url('add-form'); ?>"><?php _e('Ajouter', 'easy-form'); ?></a></h2>
        <ul class="subsubsub">
            <li class="all">
                <a href="<?php menu_page_url('forms'); ?>" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? '' : 'current'; ?>">
                    Tous <span class="count">(184)</span>
                </a> |
            </li>
            <li class="trash">
                <a href="<?php menu_page_url('forms'); ?>&amp;post_status=trash" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? 'current' : ''; ?>">Corbeille <span class="count">(3)</span></a>
            </li>
        </ul>
        <?php /** @var FormListTable $formTable */ $formTable->display(); ?>
    </div>
</div>

<?php _e('', 'easy-form'); ?>

<?php __('','easy-form') ?>
