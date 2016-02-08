<div class="wrap gf_browser_chrome">
    <form action="<?php echo $_SERVER['REQUEST_URI'];?>&noheader=true" novalidate method="post">
        <?php

        // If it's a modification, I put the id in a hidden field
        /** @var $form WP_Post */
        if(isset($form)): ?>
            <input type="hidden" name="form-id" value="<?php echo $form->ID; ?>">
        <?php endif; ?>
        <h2><?php _e('1 - Informations principales', 'easy-form'); ?> </h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-6">
                    <label for="form-title"><?php _e('Titre du formulaire', 'easy-form'); ?></label>
                    <input type="text" id="form-title" <?php echo isset($form) ? 'readonly' : ''; ?> value="<?php echo isset($form->post_title) ? $form->post_title : ''; ?>" name="form-title" class="form-control" placeholder="<?php _e('Titre du formulaire', 'easy-form'); ?>" required/>
                </div>
                <div class="col-sm-3">
                    <label for="form-action"><?php _e('Action', 'easy-form'); ?></label>
                    <input type="text" class="form-control" id="form-action" value="<?php echo isset($formMetas['action'][0]) ? $formMetas['action'][0] : '#'; ?>"  name="form-action"  placeholder="<?php _e('Action du formulaire', 'easy-form'); ?>"/>
                </div>
                <div class="col-sm-3">
                    <label for="form-class-defaut"><?php _e('Class par défaut', 'easy-form'); ?></label>
                    <input type="text" id="form-class-defaut" name="form-class-defaut" class="form-control" value="<?php echo isset($formArgs[0]['defaultClass']) ? $formArgs[0]['defaultClass'] : 'form-control'; ?>"  placeholder="<?php _e('Class par defaut des champs', 'easy-form'); ?>"/>
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-class"><?php _e('Class du formulaire', 'easy-form'); ?></label>
                    <input type="text" id="form-class" value="<?php echo isset($formArgs[0]['class']) ? $formArgs[0]['class'] : ''; ?>" name="form-class" class="form-control" placeholder="<?php _e('Class du formulaire', 'easy-form'); ?>"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-id-form"><?php _e('Id du formulaire', 'easy-form'); ?></label>
                    <input type="text" class="form-control" id="form-id-form" value="<?php echo isset($formArgs['id'][0]) ? $formArgs['id'][0] : ''; ?>"  name="form-id-form"  placeholder="<?php _e('Id du formulaire', 'easy-form'); ?>"/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6 col-md-5 col-lg-4">
                    <input type="checkbox"  id="form-display-errors" value="1" <?php echo isset($formArgs[0]['displayErrors']) ? 'checked' : ''; ?>  name="form-display-errors"/>
                    <label for="form-display-errors" class="label-checkbox"><?php _e('Afficher les erreurs de chaque champ', 'easy-form'); ?></label>
                </div>
                <div class="col-sm-6 col-md-5 col-lg-4">
                    <input type="checkbox"  id="form-display-errors-before" value="1" <?php echo isset($formArgs[0]['displayErrorsBefore']) ? 'checked' : ''; ?>  name="form-display-errors-before"/>
                    <label for="form-display-errors-before" class="label-checkbox"><?php _e('Afficher les erreurs au dessus du champ', 'easy-form'); ?></label>
                </div>
            </div>
        </section>
        <h2><?php _e('2 - Action du formulaire', 'easy-form'); ?></h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-utility"><?php _e('Type d\'action du formulaire', 'easy-form'); ?></label>
                    <select name="form-utility" class="form-control" id="form-utility">
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'post' ) ? 'selected' : '' ; ?> value="post"><?php _e('Ajout de post', 'easy-form'); ?></option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'connexion' ) ? 'selected' : '' ; ?> value="connexion"><?php _e('Connexion', 'easy-form'); ?></option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'user' ) ? 'selected' : '' ; ?> value="user"><?php _e('Inscription ou modification', 'easy-form'); ?></option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'email' ) ? 'selected' : '' ; ?> value="email"><?php _e('Envoi de mail', 'easy-form'); ?></option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'resetPassword' ) ? 'selected' : '' ; ?> value="resetPassword"><?php _e('Réinitialiser le mot de passe', 'easy-form'); ?></option>
                    </select>
                </div>
                <div class="col-sm-4">
                    <label for="form-send-lien"><?php _e('Redirection après envoi du formulaire', 'easy-form'); ?></label>
                    <input name="form-send-lien" type="text" id="form-send-lien" placeholder="<?php _e('Lien de redirection ou ID de page', 'easy-form'); ?>" <?php echo isset($formMetas['form-redirect'][0]) ? 'value="' . $formMetas['form-redirect'][0] . '"' : ''; ?> class="form-control"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-var-url"><?php _e('Variable passée dans l\'url (espacer les variables par des & )', 'easy-form'); ?></label>
                    <input name="form-var-url" type="text" id="form-var-url" placeholder="<?php _e('Variable passée dans l\'url (sous la forme update=true)', 'easy-form'); ?>" <?php echo isset($formMetas['form-var-url'][0]) ? 'value="' . $formMetas['form-var-url'][0] . '"' : ''; ?> class="form-control"/>
                </div>
            </div>
            <!-- Display form utilities -->
            <div class="utilities form-group">
            </div>
        </section>
        <h2><?php _e('3 - Les champs', 'easy-form'); ?></h2>
        <section class="panel-wordpress" id="allfields">
            <div id="fld">
            </div>
            <div class="row">
                <button class="button button-primary button-large right" data-action="add" type="button"><?php _e('Ajouter un champ', 'easy-form'); ?></button>
            </div>
        </section>
        <h2><?php _e('4 - Bouton submit', 'easy-form'); ?></h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-button-send"><?php _e('Valeur de l\'envoi', 'easy-form'); ?></label>
                    <input type="text" value="<?php echo (isset($formMetas['form-submit-value'][0])) ? $formMetas['form-submit-value'][0] : (isset($_POST['form-button-send']) ? $_POST['form-button-send'] : 'Envoyer'); ?>" class="form-control" id="form-button-send" name="form-button-send" placeholder="<?php _e('Valeur du bouton submit', 'easy-form'); ?>"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-button-send-class"><?php _e('Class de l\'input', 'easy-form'); ?></label>
                    <input type="text" class="form-control" id="form-button-send-class" value="<?php echo (isset($submitArgs[0]['class'])) ? $submitArgs[0]['class'] : (isset($_POST['form-button-send-class']) ? $_POST['form-button-send-class'] : 'btn btn-primary'); ?>" name="form-button-send-class" placeholder="<?php _e('Class du bouton submit', 'easy-form'); ?>"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-button-send-id">id de l'input</label>
                    <input type="text" class="form-control" id="form-button-send-id" value="<?php echo (isset($submitArgs[0]['id'])) ? $submitArgs[0]['id'] : (isset($_POST['form-button-send-id']) ? $_POST['form-button-send-id'] : ''); ?>" name="form-button-send-id" placeholder="Id du bouton submit"/>
                </div>
            </div>
            <div class="row">
                <button class="button button-primary button-large right" name="add-form-plugin-bastien" value="send"><?php echo isset($form) ?  __('Modifier', 'easy-form') : __('Ajouter', 'easy-form'); ?> <?php _e('le formulaire', 'easy-form'); ?></button>
            </div>
        </section>
    </form>
</div>

<!-- Include the modal -->
<?php include __DIR__ . '/modals/modal-duplicate.php' ; ?>

<script type="text/javascript">
    // Used to call jQuery with $
    var $ = jQuery;


    var ajaxUrl = '<?php echo admin_url( 'admin-ajax.php' ); ?>';

    $.get(ajaxUrl,{input : 'input-empty',action:'input_template'},function(data){

    });

    var templatePath = '<?php echo plugins_url( '/', __FILE__ ) ; ?>';

</script>

<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/empty-inputs.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/draggable.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/functions.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/actions.js'; ?>"></script>

<!-- Permet d'afficher les formulaires -->
<?php include __DIR__ . '/../assets/js/display-form.php'; ?>

<script type="text/javascript">

    var nbfield = <?php echo isset($i) ? ($i-1) : 1; ?> ;

</script>