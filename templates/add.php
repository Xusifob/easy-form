<div class="wrap gf_browser_chrome">
    <form action="<?php echo $_SERVER['REQUEST_URI'];?>&noheader=true" method="post">
        <?php
        // If it's a modification, i put the id in a hidden field
        if(isset($form)): ?>
            <input type="hidden" name="form-id" value="<?php echo $form->ID; ?>">
        <?php endif; ?>

        <h2>1 - Informations principales</h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-6">
                    <label for="form-title">Titre du formulaire</label>
                    <input type="text" id="form-title" <?php echo isset($form) ? 'readonly' : ''; ?> value="<?php echo isset($form->post_title) ? $form->post_title : ''; ?>" name="form-title" class="form-control" placeholder="Titre du formulaire" required/>
                </div>
                <div class="col-sm-3">
                    <label for="form-action">Action</label>
                    <input type="text" class="form-control" id="form-action" value="<?php echo isset($formMetas['action'][0]) ? $formMetas['action'][0] : '#'; ?>"  name="form-action"  placeholder="Action du formulaire"/>
                </div>
                <div class="col-sm-3">
                    <label for="form-class-defaut">Class par défaut</label>
                    <input type="text" id="form-class-defaut" name="form-class-defaut" class="form-control" value="<?php echo isset($formArgs[0]['defaultClass']) ? $formArgs[0]['defaultClass'] : 'form-control'; ?>"  placeholder="Class du formulaire"/>
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-class">Class du formulaire</label>
                    <input type="text" id="form-class" value="<?php echo isset($formArgs[0]['class']) ?$formArgs[0]['class'] : ''; ?>" name="form-class" class="form-control" placeholder="Class du formulaire"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-id-form">Id du formulaire</label>
                    <input type="text" class="form-control" id="form-id-form" value="<?php echo isset($formArgs['id'][0]) ? $formArgs['id'][0] : ''; ?>"  name="form-id-form"  placeholder="Id du formulaire"/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6 col-md-5 col-lg-4">
                    <input type="checkbox"  id="form-display-errors" value="1" <?php echo isset($formArgs[0]['displayErrors']) ? 'checked' : ''; ?>  name="form-display-errors"/>
                    <label for="form-display-errors" class="label-checkbox">Afficher les erreurs de chaque champ</label>
                </div>
                <div class="col-sm-6 col-md-5 col-lg-4">
                    <input type="checkbox"  id="form-display-errors-before" value="1" <?php echo isset($formArgs[0]['displayErrorsBefore']) ? 'checked' : ''; ?>  name="form-display-errors-before"/>
                    <label for="form-display-errors-before" class="label-checkbox">Afficher les erreurs au dessus du champ</label>
                </div>
            </div>
        </section>
        <h2>2 - Action du formulaire</h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-utility">Type d'action du formulaire</label>
                    <select name="form-utility" class="form-control" id="form-utility">
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'post' ) ? 'selected' : '' ; ?> value="post">Ajout de post</option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'connexion' ) ? 'selected' : '' ; ?> value="connexion">Connexion</option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'user' ) ? 'selected' : '' ; ?> value="user">Inscription ou modification</option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'email' ) ? 'selected' : '' ; ?> value="email">Envoi de mail</option>
                        <option <?php echo (isset($formMetas['form-type'][0]) && $formMetas['form-type'][0] == 'resetPassword' ) ? 'selected' : '' ; ?> value="resetPassword">Réinitialiser le mot de passe</option>
                    </select>
                </div>
                <div class="col-sm-4">
                    <label for="form-send-lien">Redirection après envoi du formulaire</label>
                    <input name="form-send-lien" type="text" id="form-send-lien" placeholder="Lien de redirection ou ID de page" <?php echo isset($formMetas['form-redirect'][0]) ? 'value="' . $formMetas['form-redirect'][0] . '"' : ''; ?> class="form-control"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-var-url">Variable passée dans l'url (espacer les variables par des & )</label>
                    <input name="form-var-url" type="text" id="form-var-url" placeholder="Variable passée dans l'url (sous la forme update=true" <?php echo isset($formMetas['form-var-url'][0]) ? 'value="' . $formMetas['form-var-url'][0] . '"' : ''; ?> class="form-control"/>
                </div>
            </div>
            <div class="utilities form-group">
                <div class="row">
                    <?php if(isset($formMetas['form-type'][0])){ ?>
                        <?php switch ($formMetas['form-type'][0]){
                            case 'post' : ?>
                                <div class="col-sm-4">
                                    <label for="form-send-type">Type de post</label>

                                    <select name="form-send-type" id="form-send-type" class="form-control">
                                        <?php

                                        foreach ($allposts as $allpost){
                                            if(!in_array($allpost,$postDisabled)){ ?>
                                                <option value="<?php echo $allpost; ?>"<?php echo $allpost == $formSendArgs[0]['post_type'] ? ' selected ' : ''; ?>><?php echo $allpost; ?></option>
                                            <?php }
                                        } ?>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <label for="form-send-staut">Statut</label>
                                    <select id="form-send-staut" name="form-send-staut" class="form-control">
                                        <?php $post_status = get_post_stati();
                                        foreach($post_status as $post_statut){ ?>
                                            <option value="<?php echo $post_statut; ?>"><?php echo $post_statut; ?></option>
                                        <?php } ?>
                                    </select>
                                </div>
                                <?php break; ?>
                            <?php case 'connexion' : ?>
                                <div class="col-sm-4">
                                    <input type="checkbox" name="form-send-remember" id="form-send-remember" value="1"/>
                                    <label for="form-send-remember" id="form-send-remember" <?php echo isset($formSendArgs[0]['remember']) ? 'checked' : ''; ?> class="label-checkbox">Se souvenir de l\'utilisateur</label>
                                </div>

                                <?php break; ?>

                            <?php case 'user' : ?>
                                <div class="col-sm-4">
                                    <label for="form-send-role">Role</label>
                                    <select name="form-send-role" id="form-send-role" class="form-control">
                                        <option value="current" <?php echo (isset($formSendArgs[0]['role']) && $formSendArgs[0]['role'] == 'current' ) ? 'selected' : ''; ?>>Rôle actuel</option>
                                        <?php foreach($roles as $role){ ?>
                                            <option <?php echo (isset($formSendArgs[0]['role']) && $formSendArgs[0]['role'] == $role['slug'] ) ? 'selected' : ''; ?> value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
                                        <?php } ?>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <br>
                                    <input type="checkbox" name="form-connexion-user" <?php echo isset($formSendArgs[0]['connectUser']) && !empty($formSendArgs[0]['connectUser']) ? 'checked' : ''; ?> id="form-connexion-user">
                                    <label for="form-connexion-user"  class="label-checkbox">Connecter l'utilisateur à l'inscription</label>
                                </div>
                                <?php break; ?>
                            <?php case 'email' : ?>
                                <div class="col-sm-4">
                                    <label for="form-send-subject">Objet</label>
                                    <input type="text" name="form-send-subject" id="form-send-subject" <?php echo isset($formSendArgs[0]['subject']) ? 'value="'. $formSendArgs[0]['subject'] .'"' : ''; ?> placeholder="Objet" class="form-control"/>
                                </div>
                                <div class="col-sm-4">
                                    <label for="form-send-recipientEmail">Email destinataire</label>
                                    <input type="email" name="form-send-recipientEmail" id="form-send-recipientEmail" placeholder="Email destinataire" <?php echo isset($formSendArgs[0]['recipientEmail']) ? 'value="'. $formSendArgs[0]['recipientEmail'] .'"' : 'value="' . get_option('admin_email') . '"'; ?> class="form-control"/>
                                </div>
                                <div class="col-sm-4">
                                    <label for="form-send-recipientName">Nom du destinataire</label>
                                    <input type="text" name="form-send-recipientName" id="form-send-recipientName" placeholder="Nom du destinataire" <?php echo isset($formSendArgs[0]['recipientName']) ? 'value="'. $formSendArgs[0]['recipientName'] .'"' : 'value="' . get_option('blogname') . '"'; ?> class="form-control"/>
                                </div>
                                <?php break; ?>
                            <?php case 'resetPassword' : ?>
                                <div class="row form-group">
                                    <div class="col-sm-4">
                                        <label for="form-send-subject">Objet</label>
                                        <input type="text" name="form-send-subject" id="form-send-subject" <?php echo isset($formSendArgs[0]['subject']) ? 'value="'. $formSendArgs[0]['subject'] .'"' :  get_option('blogname') . ' : Réinitialisation du mot de passe'; ?> placeholder="Objet" class="form-control"/>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="form-send-senderEmail">Email de l'expéditeur</label>
                                        <input type="email" name="form-send-senderEmail" id="form-send-senderEmail" placeholder="Email expéditeur" <?php echo isset($formSendArgs[0]['senderEmail']) ? 'value="'. $formSendArgs[0]['senderEmail'] .'"' : 'value="' . get_option('admin_email') . '"'; ?> class="form-control"/>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="form-send-senderName">Nom de l'expéditeur</label>
                                        <input type="text" name="form-send-senderName" id="form-send-senderName" placeholder="Nom du expéditeur" <?php echo isset($formSendArgs[0]['senderName']) ? 'value="'. $formSendArgs[0]['senderName'] .'"' : 'value="' . get_option('blogname') . '"'; ?> class="form-control"/>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col-sm-12">
                                        <label for="form-send-message">Message</label>
                                        <p class="infos">Utilisez %PASSWORD% à la place du mot de passe et %ID% pour l'identifiant de l'utilisateur</p>
                                        <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" placeholder="Message (texte brut ou HTML)"><?php echo isset($formSendArgs[0]['message']) ? htmlspecialchars($formSendArgs[0]['message']) : ''; ?></textarea>
                                    </div>
                                </div>
                                <?php break; ?>

                            <?php } ?>
                    <?php  } else { ?>
                        <div class="col-sm-4">
                            <label for="form-send-type">Type de post</label>
                            <select name="form-send-type" id="form-send-type" class="form-control">
                                <?php
                                foreach ($allposts as $allpost){
                                    if(!in_array($allpost,$postDisabled)){ ?>
                                        <option value="<?php echo $allpost; ?>"><?php echo $allpost; ?></option>
                                    <?php }
                                } ?>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <label for="form-send-staut">Statut</label>
                            <select id="form-send-staut" name="form-send-staut" class="form-control">
                                <?php $post_status = get_post_stati();
                                foreach($post_status as $post_statut){ ?>
                                    <option value="<?php echo $post_statut; ?>"><?php echo $post_statut; ?></option>
                                <?php } ?>
                            </select>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </section>
        <h2>3 - Les champs</h2>
        <section class="panel-wordpress" id="allfields">
            <div id="fld">

            </div>
            <div class="row">
                <button class="button button-primary button-large right" data-action="add" type="button">Ajouter un champ</button>
            </div>
        </section>
        <h2>4 - Bouton submit</h2>
        <section class="panel-wordpress">
            <div class="row form-group">
                <div class="col-sm-4">
                    <label for="form-button-send">Valeur de l'envoi</label>
                    <input type="text" value="<?php echo (isset($formMetas['form-submit-value'][0])) ? $formMetas['form-submit-value'][0] : (isset($_POST['form-button-send']) ? $_POST['form-button-send'] : 'Envoyer'); ?>" class="form-control" id="form-button-send" name="form-button-send" placeholder="Valeur du bouton submit"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-button-send-class">Class de l'input</label>
                    <input type="text" class="form-control" id="form-button-send-class" value="<?php echo (isset($submitArgs[0]['class'])) ? $submitArgs[0]['class'] : (isset($_POST['form-button-send-class']) ? $_POST['form-button-send-class'] : 'btn btn-primary'); ?>" name="form-button-send-class" placeholder="Class du bouton submit"/>
                </div>
                <div class="col-sm-4">
                    <label for="form-button-send-id">id de l'input</label>
                    <input type="text" class="form-control" id="form-button-send-id" value="<?php echo (isset($submitArgs[0]['id'])) ? $submitArgs[0]['id'] : (isset($_POST['form-button-send-id']) ? $_POST['form-button-send-id'] : ''); ?>" name="form-button-send-id" placeholder="Id du bouton submit"/>
                </div>
            </div>
            <div class="row">
                <button class="button button-primary button-large right" name="add-form-plugin-bastien" value="send"><?php echo isset($form) ? 'Modifier' : 'Ajouter'; ?> le formulaire</button>
            </div>
        </section>
    </form>
</div>

<!-- Include the modal -->
<?php include __DIR__ . '/modals/modal-duplicate.php' ; ?>
<script type="text/javascript">
    // Used to call jQuery with $
    var $ = jQuery;
</script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/empty-inputs.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/modal-duplicate.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/draggable.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/functions.js'; ?>"></script>
<script type="text/javascript" src="<?php echo plugins_url() . '/easy-form/assets/js/actions.js'; ?>"></script>

<!-- Permet d'afficher les formulaires -->
<?php include __DIR__ . '/../assets/js/display-form.php'; ?>

<script type="text/javascript">

    var nbfield = <?php echo isset($i) ? ($i-1) : 1; ?> ;
    var utilities = {
        post: '<div class="row">' +
        '<div class="col-sm-4">' +
        '<label for="form-send-type">Type de post</label>' +
        '<select name="form-send-type" class="form-control" id="form-send-type">' +
        <?php
        foreach ($allposts as $allpost){
            if(!in_array($allpost,$postDisabled)){ ?>
        '<option value="<?php echo $allpost; ?>"><?php echo $allpost; ?></option>' +
        <?php } } ?>
        '</select>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<label for="form-send-staut">Statut</label>' +
        '<select id="form-send-staut" class="form-control" name="form-send-staut">' +
        <?php $post_status = get_post_stati();
        foreach($post_status as $post_statut){ ?>
        '<option value="<?php echo $post_statut; ?>"><?php echo $post_statut; ?></option>' +
        <?php } ?>
        '</select>' +
        '</div>' +
        '</div>',

        user: '<div class="row">' +
        '<div class="col-sm-4">' +
        '<label for="form-send-role">Role</label>' +
        '<select name="form-send-role" id="form-send-role" class="form-control">' +
        <?php foreach($roles as $role){ ?>
        '<option <?php echo (isset($formSendArgs[0]['role']) && $formSendArgs[0]['role'] == $role['slug'] ) ? 'selected' : ''; ?> value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>' +
        <?php } ?>
        '</select>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<br>' +
        '<input type="checkbox" name="form-connexion-user" id="form-connexion-user">' +
        '<label for="form-connexion-user" class="label-checkbox">Connecter l\'utilisateur à l\'inscription</label>' +
        '</div>' +
        '</div>',

        email: '<div class="row">' +
        '<div class="col-sm-4">' +
        '<label for="form-send-subject">Objet</label>' +
        '<input type="text" name="form-send-subject" id="form-send-subject" placeholder="Objet" class="form-control"/>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<label for="form-send-recipientEmail">Email destinataire</label>' +
        '<input type="email" name="form-send-recipientEmail" id="form-send-recipientEmail" placeholder="Email destinataire" value="<?php echo get_option('admin_email'); ?>" class="form-control"/>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<label for="form-send-recipientName">Nom du destinataire</label>' +
        '<input type="text" name="form-send-recipientName" id="form-send-recipientName" placeholder="Nom du destinataire" value="<?php echo get_option('blogname'); ?>" class="form-control"/>' +
        '</div>' +
        '</div>',

        connexion: '<div class="row">' +
        '<div class="col-sm-4">' +
        '<input type="checkbox" name="form-send-remember" id="form-send-remember" value="1"/>' +
        '<label for="form-send-remember" id="form-send-remember" class="label-checkbox">Se souvenir de l\'utilisateur</label>' +
        '</div>' +
        '</div>',

        resetPassword : '<div class="row form-group">' +
        '<div class="col-sm-4">' +
        '<label for="form-send-subject">Objet</label>' +
        '<input type="text" name="form-send-subject" id="form-send-subject" value="Réinitialisation du mot de passe" ?> placeholder="Objet" class="form-control"/>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<label for="form-send-senderEmail">Email de l\'expéditeur</label>' +
        '<input type="email" name="form-send-senderEmail" id="form-send-senderEmail" placeholder="Email expéditeur"  value="<?php echo addslashes(get_option('admin_email')); ?>" class="form-control"/>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<label for="form-send-senderName">Nom de l\'expéditeur</label>' +
        '<input type="text" name="form-send-senderName" id="form-send-senderName" placeholder="Nom du expéditeur"  value="<?php echo addslashes(get_option('blogname')); ?>" class="form-control"/>' +
        '</div>' +
        '</div>' +
        '<div class="row form-group">' +
        '<div class="col-sm-12">' +
        '<label for="form-send-message">Message</label>' +
        '<p class="infos">Utilisez %PASSWORD% à la place du mot de passe et %ID% pour l\'identifiant de l\'utilisateur</p>' +
        '<textarea name="form-send-message" id="form-send-message" cols="30" rows="10" placeholder="Message (texte brut ou HTML)"></textarea>' +
        '</div>' +
        '</div>'
    };
</script>