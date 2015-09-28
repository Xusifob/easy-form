<div class="wrap gf_browser_chrome">
    <h2>Importer un formulaire</h2>

    <?php if(isset($error) && is_string($error)): ?>
        <?php echo $error; ?>
    <?php endif; ?>
    <section class="panel-wordpress">
        <div class="form-group">
            <div class="form-group">
                <h2>Séléctionnez votre formulaire Json</h2>
            </div>
        </div>
        <form action="#" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input type="file" name="import-form" id="import-form" class="sr-only"/>
                <label for="import-form" class="button button-primary button-large">Séléctionner le fichier</label>
            </div>
            <div class="form-group">
                <input type="submit" class="button button-primary button-large" name="import-forms-bastien" value="importer"/>
            </div>
        </form>
        <?php if(isset($downloadButton)): ?>
            <hr>
            <h2>Formulaires exportés</h2>
            <?php echo $downloadButton; ?>
        <?php endif; ?>
    </section>
</div>

<script type="text/javascript">
    jQuery(function($){
        $(':file').change(function(){
            var file = this.files[0];
            var name = file.name;

            var id = $(this).attr('id');

            $('label[for="' + id + '"]').html(name);
        });
    })
</script>