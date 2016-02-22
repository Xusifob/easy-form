<?php  if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="wrap gf_browser_chrome">
    <div class="wrap">
        <div id="icon-users" class="icon32"></div>
        <h2><?php _e('Formulaires', 'easy-form'); ?> <a class="add-new-h2" href="<?php menu_page_url('add-form'); ?>"><?php _e('Ajouter', 'easy-form'); ?></a></h2>
        <ul class="subsubsub">
            <li class="all">
                <a href="<?php menu_page_url('forms'); ?>" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? '' : 'current'; ?>">
                    <?php _e('Tous', 'easy-form'); ?> <span class="count">(<?php echo $available; ?>)</span>
                </a> |
            </li>
            <li class="trash">
                <a href="<?php menu_page_url('forms'); ?>&amp;post_status=trash" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? 'current' : ''; ?>"><?php _e('Corbeille', 'easy-form'); ?>
                    <span class="count">(<?php echo $trash; ?>)</span></a>
            </li>
        </ul>
        <form id="events-filter" method="get">
            <?php if (is_array($_GET)) foreach ($_GET as $key => $val) { ?>
                <input type="hidden" name="<?php echo $key; ?>" value="<?php echo $val; ?>">
            <?php } ?>
            <?php /** @var FormListTable $formTable */ $formTable->display(); ?>
        </form>
    </div>
</div>

<?php _e('', 'easy-form'); ?>

<?php __('','easy-form') ?>
