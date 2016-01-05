<div class="modal fade bs-example-modal-sm" tabindex="-1" id="modal-duplicate" role="dialog" aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <form action="<?php echo $_SERVER['REQUEST_URI'];?>&noheader=true" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <?php /** @var $form WP_Post */ ?>
                    <h4 class="modal-title">Dupliquer un formulaire</h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="form-duplicate-id"/>
                    <label for="form-duplicate-name">Nom du nouveau formulaire</label>
                    <input type="text" class="form-control" required placeholder="Nom du nouveau formulaire" name="form-duplicate-name" id="form-duplicate-name" />
                </div>
                <div class="modal-footer">
                    <input type="submit" value="Dupliquer" class="button button-primary button-large left" name="form-duplicate"/>
                </div>
            </form>
        </div>
    </div>
</div>


<script type="text/javascript">
    jQuery(function($){
        $('a[data-target="#modal-duplicate"]').on('click',function()
        {
            $('input[name="form-duplicate-id"]').val(
                $(this).attr('data-form')
            );
        })
    });
</script>

