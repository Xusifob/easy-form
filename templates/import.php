<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<div class="wrap gf_browser_chrome">
    <section class="panel-wordpress">
        <div class="head">
            <h2><?php _e('Importer un formulaire', 'easy-form'); ?></h2>
        </div>
        <div class="form-group">
            <div class="form-group">
                <p><?php _e('Séléctionnez votre formulaire Json', 'easy-form'); ?></p>
            </div>
        </div>

        <?php if (isset($error) && is_string($error)): ?>
            <div class="alert alert-danger" role="alert">
                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span class="sr-only">Error:</span>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>


        <?php if (isset($success) && is_string($success)): ?>
            <div class="alert alert-success" role="alert">
                <?php echo $success; ?>
            </div>
        <?php endif; ?>
        <form action="#" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input type="file" name="import-form" id="import-form"/>
            </div>
            <div class="form-group">
                <input type="submit" class="button button-primary button-large" name="import-forms-bastien"
                       value="<?php _e('Importer', 'easy-form'); ?>"/>
            </div>
        </form>
        <?php if (isset($downloadButton)): ?>
            <hr>
            <h2><?php _e('Formulaires exportés', 'easy-form'); ?></h2>
            <?php echo $downloadButton; ?>
        <?php endif; ?>
    </section>
</div>

<script type="text/javascript">
    jQuery(function ($) {
        $(':file').change(function () {
            var file = this.files[0];
            var name = file.name;

            var id = $(this).attr('id');

            $('label[for="' + id + '"]').html(name);
        });
    })
</script>