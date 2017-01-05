<?php  if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<?php global /** @var EF_List_Table $table */  $table; ?>
<div class="wrap gf_browser_chrome">
    <div class="wrap">
        <div id="icon-users" class="icon32"></div>
        <h2><?php _e('Forms', EF_get_domain()); ?> <a class="add-new-h2" href="<?php menu_page_url('EF_add'); ?>"><?php _e('Add', EF_get_domain()); ?></a></h2>
        <ul class="subsubsub">
            <li class="all">
                <a href="<?php menu_page_url('EF_list'); ?>" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? '' : 'current'; ?>">
                    <?php _e('All',EF_get_domain()); ?> <span class="count">(<?php echo count($table->getFromStatus('publish')); ?>)</span>
                </a> |
            </li>
            <li class="trash">
                <a href="<?php menu_page_url('EF_list'); ?>&amp;post_status=trash" class="<?php echo isset($_GET['post_status']) && $_GET['post_status'] == 'trash' ? 'current' : ''; ?>"><?php _e('Trash',EF_get_domain()); ?> <span class="count">(<?php echo count($table->getFromStatus('trash')); ?>)</span></a>
            </li>
        </ul>
        <?php $table->display(); ?>
    </div>
</div>


<!-- Modal -->
<div class="modal fade bs-example-modal-sm" tabindex="-1" id="modal-duplicate" role="dialog" >
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <form action="<?php echo $_SERVER['REQUEST_URI']; ?>&noheader=true" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <?php /** @var $form WP_Post */ ?>
                    <h4 class="modal-title"><?php _e('Duplicate a form',EF_get_domain()); ?></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="form-duplicate-id"/>
                    <label for="form-duplicate-name"><?php _e('Name of the form',EF_get_domain()); ?></label>
                    <input type="text" class="form-control" required
                           placeholder="<?php _e('Name of the new form',EF_get_domain()); ?>"
                           name="form-duplicate-name" id="form-duplicate-name"/>
                </div>
                <div class="modal-footer">
                    <input type="submit" value="<?php _e('Duplicate', EF_get_domain()); ?>"
                           class="button button-primary button-large left" name="form-duplicate"/>
                </div>
            </form>
        </div>
    </div>
</div>


<script type="text/javascript">
    jQuery(function ($) {
        $('a[data-target="#modal-duplicate"]').on('click', function () {
            $('input[name="form-duplicate-id"]').val(
                $(this).attr('data-form')
            );
        })
    });
</script>