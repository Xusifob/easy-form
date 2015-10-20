<?php
$inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden','file','textarea','taxonomy','wp_editor','open container','close container', 'close all container',
];

$roles = FormPlugin::GetAllRoles();

$allposts = get_post_types();

$postDisabled = ['page','revision','attachment','nav_menu_item','acf-field','acf-field-group'];

?>
<div class="wrap gf_browser_chrome">
    <form action="<?php echo $_SERVER['REQUEST_URI'];?>&noheader=true" method="post">
        <?php
        // If it's a modification, i put the id in a hidden field
        if(isset($form)):
            ?>
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



<script type="text/javascript">
    jQuery(function($){
        $('.move').on('click',function() {
            var fieldId = $(this).attr('data-field');
            $('#form-duplicate-field-id').val(fieldId);
            $('#modal-move').modal('show');

            return false;
        })
    });
</script>

<?php if(isset($form)) {
    $i = 1;
    foreach ($formFields[0] as $key => $field) {
        $formFields[0][$key]['id'] = $i;
        $i++;
    }
}
?>


<!-- Permet d'afficher un formulaire existant -->
<script type="text/javascript">
    var inputs = [
        'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden','textarea'
    ];

    jQuery(function($){
        <?php
        if(isset($formFields[0])):
            echo 'var fields = ' .  json_encode($formFields[0]) . ';';
        else : ?>
        var fields = [{
            id: 1,
            name : '',
            type : 'text',
            args : {
                autocomplete : true,
                'class' : '',
                id : '',
                label : '',
                labelAfter : false,
                labelClass : '',
                placeholder : '',
                readOnly : false,
                required : true,
                value : ''
            }
        }];
        <?php endif; ?>


        var fieldIncrement = 0;
        function retrieveData(){
            if(fieldIncrement <fields.length){
                getData(fields[fieldIncrement]);
            }
        }

        function getData(field){

            // Je récupère la base
            $.get('<?php echo get_bloginfo('wpurl') ?>/wp-content/plugins/easy-form/templates/inputs/input-empty.php',function(base){

                if($.inArray(field.type,inputs) !== -1) {
                    var template = '<?php echo get_bloginfo('wpurl') ?>/wp-content/plugins/easy-form/templates/inputs/input.php';
                }else {
                    var template = '<?php echo get_bloginfo('wpurl') ?>/wp-content/plugins/easy-form/templates/inputs/' + field.type + '.php';
                }
                $.get(template, function (data) {
                }).always(function(data){

                    // Je met la base
                    data = replace(base,'input-content',data);

                    // Je remplie les champs
                    data = replace(data, 'fieldId', field.id);
                    data = replace(data, 'field-id', field.args.id);
                    data = replace(data, 'field-name', field.name);

                    if(field.args.class != undefined)
                        data = replace(data, 'field-class', field.args.class);
                    if(field.args.placeholder != undefined)
                        data = replace(data, 'field-placeholder', field.args.placeholder);

                    if(field.args.value != undefined)
                        data = replace(data, 'field-value', field.args.value);
                    if(field.args.label != undefined)
                        data = replace(data, 'field-label', field.args.label);

                    // Select
                    data = replace(data, 'option value="'+ field.type +'"', 'option selected value="'+ field.type +'"');

                    $("#fld").append(data);
                    fieldIncrement++;
                    retrieveData();
                });
            });
        }

        // J'affiche tous les champs sur la page
        retrieveData();
    });
</script>


<script type="text/javascript">
    jQuery(function($){
        // Au changement du form type
        $('body').on('change','select[name$="form-type]"]',function(){
            var val = $(this).val();
            var id = $(this).attr('data-field');
            var options = {
                inputs :
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<label>Options</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-id]" class="form-control" placeholder="Id du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-class]" class="form-control" placeholder="Class du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-placeholder]" class="form-control" placeholder="Placeholder du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-value]" class="form-control" placeholder="Valeur du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label]" class="form-control" placeholder="Label"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label-class]" class="form-control" placeholder="Class du label"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-required]" name="field['+ id +'][form-required]" value="1" checked/> <label for="field['+ id +'][form-required]" class="label-checkbox"> Required</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-autocomplete]" name="field['+ id +'][form-autocomplete]" value="1" checked/> <label for="field['+ id +'][form-autocomplete]" class="label-checkbox"> Autocomplete</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-label-after]" name="field['+ id +'][form-label-after]" value="1"/> <label for="field['+ id +'][form-label-after]" class="label-checkbox">Placer le label après le champ</label>' +
                '</div>' +
                '</div>' +
                '</div>',
                openContainer :
                '<div class="row form-group">' +
                '<div class="col-md-4">' +
                '<input type="text" name="field['+ id +'][form-container]" class="form-control" value="div" placeholder="Type du container"/>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<input type="text" name="field['+ id +'][form-container-class]" data-field="'+ id +'" class="form-control" placeholder="Class du container"/>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<input type="text" name="field['+ id +'][form-container-id]" class="form-control" placeholder="id du container"/>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-readonly]" name="field['+ id +'][form-readonly]" value="1" /> <label for="field['+ id +'][form-readonly]" class="label-checkbox"> Read only</label>' +
                '</div>' +
                '</div>' +
                '</div>',

                select :
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<label>Options</label>' +
                '</div>' +
                '</div>' +
                '<div class="row form-group">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-id]" class="form-control" placeholder="Id du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-class]" class="form-control" placeholder="Class du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label]" class="form-control" placeholder="Label"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label-class]" class="form-control" placeholder="Class du label"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-required]" name="field['+ id +'][form-required]" value="1" checked/> <label for="field['+ id +'][form-required]" class="label-checkbox"> Required</label>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-label-after]" name="field['+ id +'][form-label-after]" value="1"/> <label for="field['+ id +'][form-label-after]" class="label-checkbox">Placer le label après le champ</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<label for="form-order-by">Trier les champs par</label>' +
                '<div class="row form-group">' +
                '<div class="col-sm-4">' +
                '<select name="field['+ id +'][form-order-by]" id="field['+ id +'][form-order-by]" class="form-control">' +
                '<option value="default">Défaut</option>' +
                '<option value="croissant">Croissant</option>' +
                '<option value="décroissant">Décroissant</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<label>Options du select</label>' +
                '<div class="row option-select" id="option-select'+ id +'-1">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" id="field['+ id +'][form-select-option-name][1]" name="field['+ id +'][form-select-option][1][name]" placeholder="Nom de l\'option" class="form-control" required/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" id="field['+ id +'][form-select-option-name][1]" name="field['+ id +'][form-select-option][1][value]" placeholder="Valeur de l\'option" class="form-control" required/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-3">' +
                '<input type="radio" id="field['+ id +'][form-select-option-selected][1]" name="field['+ id +'][form-select-option-selected]" value="1"  class="form-control" required/>' +
                '<label for="field['+ id +'][form-select-option-selected][1]" class="label-checkbox">Ce champ est séléctionné</label>' +
                '</div>' +
                '<div class="col-sm-1">' +
                '<a href="#" data-field="'+ id +'" data-option="1" class="upanddown removeoption">×</a>' +
                '</div>' +
                '</div>' +
                '<button class="button button-primary button-large left" data-action="add-option" data-field="1" type="button">Ajouter une option</button>' +
                '<hr>',
                taxonomy :
                '<div class="row form-group">' +
                '<div class="col-sm-4">' +
                '<label for="field['+ id +'][form-taxonomy]">Taxonomy</label>' +
                '<select data-field="'+ id +'" name="field['+ id +'][form-taxonomy]" id="field['+ id +'][form-taxonomy]" class="form-control">' +

                <?php $taxonomies = get_taxonomies();

                foreach($taxonomies as $key => $taxonomy){
                $taxonomy = get_taxonomy($taxonomy)
                ?>
                '<option value="<?php echo addslashes($taxonomy->name); ?>"><?php echo addslashes($taxonomy->label); ?></option>' +
                <?php
                } ?>
                '</select>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<label for="field['+ id +'][form-taxonomy-type]">Type de champ</label>' +
                '<select data-field="'+ id +'" name="field['+ id +'][form-taxonomy-type]" id="field['+ id +'][form-taxonomy-type]" class="form-control">' +
                '<option value="select">Select</option>' +
                '<option value="hidden">Hidden</option>' +
                '<!--<option value="radio">Radio</option>' +
                '<option value="checkbox">Checkbox</option>-->' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<label>Options</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-id]" class="form-control" placeholder="Id du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-class]" class="form-control" placeholder="Class du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-empty-field]" class="form-control" placeholder="Valeur du champ vide">' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-value]" class="form-control" placeholder="Valeur du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label]" class="form-control" placeholder="Label"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label-class]" class="form-control" placeholder="Class du label"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-required]" name="field['+ id +'][form-required]" value="1" checked/> <label for="field['+ id +'][form-required]" class="label-checkbox"> Required</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-label-after]" name="field['+ id +'][form-label-after]" value="1"/> <label for="field['+ id +'][form-label-after]" class="label-checkbox">Placer le label après le champ</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-readonly]" name="field['+ id +'][form-readonly]" value="1" /> <label for="field['+ id +'][form-readonly]" class="label-checkbox"> Read only</label>' +
                '</div>' +
                '</div>' +
                '</div>',

                file :
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<label>Options</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-id]" class="form-control" placeholder="Id du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-class]" class="form-control" placeholder="Class du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-allowed]" class="form-control" value="png,jpg,jpeg,pdf,gif" placeholder="Extensions autorisés (espacer par des virgules)"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-acf-field]" class="form-control" placeholder="Nom du champ ACF galerie"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label]" class="form-control" placeholder="Label"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-label-class]" class="form-control" placeholder="Class du label"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field['+ id +'][form-max-size]"  class="form-control" placeholder="Taille maximum d\'un fichier uploadé (en ko)"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-required]" name="field['+ id +'][form-required]" value="1" checked/> <label for="field['+ id +'][form-required]" class="label-checkbox"> Required</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-multiple]" name="field['+ id +'][form-multiple]" value="1" /> <label for="field['+ id +'][form-multiple]" class="label-checkbox"> Multiple</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ id +'][form-label-after]" name="field['+ id +'][form-label-after]" value="1"/> <label for="field['+ id +'][form-label-after]" class="label-checkbox">Placer le label après le champ</label>' +
                '</div>' +
                '</div>' +
                '</div>',
            };

            if($.inArray(val,inputs) != -1){
                $('.options-' + id).html(options.inputs).show(200);
                if(val == 'checkbox' || val == 'radio'){
                    $('input[name="field['+ id +'][form-placeholder]"]').css('visibility','hidden').val('');
                    $('input[name="field['+ id +'][form-autocomplete]"]').parent().parent().remove();
                    $('input[name="field['+ id +'][form-required]"]').removeAttr('checked');
                }

            }else if (val == 'open_container') {
                $('.options-' + id).html(options.openContainer).show(200);
            }else if (val == 'close_container' || val == 'close_all_container') {
                $('.options-' + id).html('').show(200);
                $('input[name="field['+ id +'][form-name]"').val('Close container');
            }else if(val == 'select'){
                $('.options-' + id).html(options.select).show(200);
            }else if(val == 'taxonomy'){
                $('.options-' + id).html(options.taxonomy).show(200);
            }else if(val == 'file'){
                $('.options-' + id).html(options.file).show(200);
            }

            // Handle the open button
            $('.open[data-field="'+ id + '"]')
                .html('-')
                .removeClass('open')
                .addClass('minify');
        });
        var nbfield = <?php echo isset($i) ? ($i-1) : 1; ?> ;


        var DraggableArgs = {
            containment : '#container',
            opacity: 1,
            zIndex: 100,
            cursor : 'move',
            handle : '.col-sm-7 label',

            start: function( event, ui ) {
                // I close all fields
                $('.minify').each(function(){
                    $(this).click();
                });

            },



            drag : function(event,ui){
                var top = $(this).offset().top - $('#allfields').offset().top;

                var height = $(this).height();

                // The new id of the field
                var nbField = Math.min(Math.max(Math.ceil((top - 50)/height),1),nbfield);

                var oldnbField = parseInt($(this).attr('id').substr(6));

                $(this).append('<span class="info"></span>');
                $(this).children('.info').html(nbField);

                $('div[id^="field-"]').each(function(){
                    $(this).removeClass('hovered');
                });
                if(oldnbField != nbField) {
                    $('#field-' + nbField).addClass('hovered');
                }
            },


            stop: function(event, element){

                var top = $(this).offset().top - $('#allfields').offset().top;

                var height = $(this).height();

                // The new id of the field
                var nbField = Math.min(Math.max(Math.ceil((top - 50)/height),1),nbfield);

                // L'id du champ qui bouge
                var oldnbField = parseInt($(this).attr('id').substr(6));

                $(this).attr('style','position: relative;');

                // Je retire la class hovered
                $('div[id^="field-"]').each(function(){
                    $(this).removeClass('hovered');
                });

                // Je bouge que si le champ est différent
                if(nbField != oldnbField) {
                    /*if(nbField == 1){
                     $('#field-' + nbField).before($(this));
                     }else{
                     $('#field-' + nbField).after($(this));
                     } */
                    if(oldnbField < nbField){
                        // Je descend le champ
                        for(var k = oldnbField;k < nbField;k++){
                            switchIds(k,k+1);
                        }
                    }else{

                        // Je monte le champ
                        for(var k = oldnbField;k > nbField;k--){
                            switchIds(k,k-1);
                        }
                        // J'échange les id
                    }
                }

            }
        };



        $('button[data-action="add"]').on('click',function(){
            $('.minify').each(function(){
                $(this).click();
            });
            nbfield++;
            var template = '<div class="row form-group" id="field-' + nbfield + '">' +
                '<hr><div class="col-sm-12">' +
                '<div class="row form-group">' +
                '<div class="col-sm-1">' +
                '<div class="row">' +
                '<div class="col-xs-6">' +
                '<strong class="field-number">' + nbfield + '</strong>' +
                '</div>' +
                '<div class="col-xs-6">' +
                '<a href="#" class="up upanddown" data-field="' + nbfield + '">↑</a>' +
                '<a href="#" class="down upanddown" data-field="' + nbfield + '">↓</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-7">' +
                '<label for="field[' + nbfield + '][form-name]">Nom du champ</label>' +
                '<input type="text" name="field[' + nbfield + '][form-name]" class="form-control" placeholder="Nom du champ" required/>' +
                '<a href="#" class="dupliquer" data-field="' + nbfield + '">Dupliquer</a>' +
                '</div>' +
                '<div class="col-sm-3">' +
                '<label for="field[' + nbfield + '][form-type]">Type de champ</label>' +
                '<select name="field[' + nbfield + '][form-type]" class="form-control" id="field[' + nbfield + '][form-type]" data-field="' + nbfield + '">' +
                '<?php foreach($inputs as $val){ ?>' +
                '<option value="<?php echo str_replace(' ', '_',$val); ?>"><?php echo $val; ?></option>' +
                '<?php } ?>' +
                '</select>' +
                '</div>' +
                '<div class="col-sm-1">' +
                '<a href="#" data-field="' + nbfield + '" class="delete upanddown">×</a>' +
                '<a href="#" data-field="' + nbfield + '" class="minify upanddown">-</a>' +
                '</div>' +
                '</div>' +
                '<div class="options-' + nbfield + '">' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<label>Options</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-id]" class="form-control" placeholder="Id du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-class]" class="form-control" placeholder="Class du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-placeholder]" class="form-control" placeholder="Placeholder du champ"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-value]" class="form-control" placeholder="Valeur du champ"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-label]" class="form-control" placeholder="Label"/>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="text" name="field[' + nbfield + '][form-label-class]" class="form-control" placeholder="Class du label"/>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field[' + nbfield + '][form-required]" name="field[' + nbfield + '][form-required]" value="1" checked/> <label for="field[' + nbfield + '][form-required]" class="label-checkbox"> Required</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field[' + nbfield + '][form-autocomplete]" name="field[' + nbfield + '][form-autocomplete]" value="1" checked/> <label for="field[' + nbfield + '][form-autocomplete]" class="label-checkbox"> Autocomplete</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field[' + nbfield + '][form-label-after]" name="field[' + nbfield + '][form-label-after]" value="1"/> <label for="field[' + nbfield + '][form-label-after]" class="label-checkbox">Placer le label après le champ</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<input type="checkbox" id="field['+ nbfield +'][form-readonly]" name="field['+ nbfield +'][form-readonly]" value="1" /> <label for="field['+ nbfield +'][form-readonly]" class="label-checkbox"> Read only</label>' +
                '</div>' +
                '</div>' +
                '<hr>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $('div[id="field-'+ (nbfield-1) +'"]').after(template);
            $('div[id="field-'+ nbfield +'"]').draggable(DraggableArgs);
        });

        $('body')
            .on('click','.delete',function(){
                var id = parseInt($(this).attr('data-field'));
                $("#field-" + id).remove();
                for (var j=id+1;j<=nbfield;j++)
                    updateIds($('#field-' + j),j,j-1);
                nbfield--;

                return false;


            }).on('click','.minify',function(){

                var id = $(this).attr('data-field');
                $('.options-'+ id ).hide(200);
                $(this)
                    .removeClass('minify')
                    .addClass('open')
                    .html('+');
                return false;


            }).on('click','.open',function(){
                var id = parseInt($(this).attr('data-field'));
                $('.options-'+ id ).show(200);
                $(this)
                    .removeClass('open')
                    .addClass('minify')
                    .html('-')
                ;
                return false;

            })
            .on('click','.up',function(){
                var id = parseInt($(this).attr('data-field'));
                if(id != 1)
                    switchIds(id,id-1);

                return false;
            })
            .on('click','.down',function(){
                var id = parseInt($(this).attr('data-field'));
                if(id != nbfield)
                    switchIds(id,id+1);

                return false;
            })
            .on('click','.dupliquer',function(){
                var id = parseInt($(this).attr('data-field'));

                var thefield = $('#field-' + id);

                var clonedField = thefield.clone();
                $('div[id="field-' + nbfield + '"]').after(clonedField);

                updateIds(clonedField,id,(nbfield+1));

                var val = $('select[name="field['+ id +'][form-type]"]').val();

                $('select[name="field['+ (nbfield+1) +'][form-type]"]').val(val);
                clonedField.draggable(DraggableArgs);
                nbfield++;
                return false;
            })
            .on('click','button[data-action="add-option"]',function(){

                var id = parseInt($(this).attr('data-field'));

                var nbOptions = $('.option-select').length +1;

                $(this).before(
                    '<div class="row option-select" id="option-select'+ id +'-'+ nbOptions +'">' +
                    '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<input type="text" id="field['+ id +'][form-select-option-name]['+ nbOptions +']" name="field['+ id +'][form-select-option]['+ nbOptions +'][name]" placeholder="Nom de l\'option" class="form-control" required/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<input type="text" id="field['+ id +'][form-select-option-name]['+ nbOptions +']" name="field['+ id +'][form-select-option]['+ nbOptions +'][value]" placeholder="Valeur de l\'option" class="form-control" required/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-sm-3">' +
                    '<input type="radio" id="field['+ id +'][form-select-option-selected]['+ nbOptions +']" name="field['+ id +'][form-select-option-selected]" value="'+ nbOptions +'"  class="form-control" required/>' +
                    '<label for="field['+ id +'][form-select-option-selected]['+ nbOptions +']" class="label-checkbox">Ce champ est séléctionné</label>' +
                    '</div>' +
                    '<div class="col-sm-1">' +
                    '<a href="#" data-field="'+ id +'" data-option="'+ nbOptions +'" class="upanddown removeoption">×</a>' +
                    '</div>' +
                    '</div>'
                );
            })
            .on('click','.removeoption',function(){
                var id = parseInt($(this).attr('data-field'));
                var option = parseInt($(this).attr('data-option'));

                $('#option-select'+ id +'-'+ option).empty();


                return false;
            })
            .on('keyup','input[name$="form-container-class]"]',function(){
                var id = parseInt($(this).attr('data-field'));
                var input = $('input[name="field['+ id +'][form-name]"');
                input.val($(this).val());
            })
            .on('change','select[name$="[form-taxonomy]"]',function(){
                var id = parseInt($(this).attr('data-field'));

                var val = $(this).val();

                $('input[name="field['+ id +'][form-name]"]').val('taxonomy_'+ val);
            });
        ;



        // Update fields
        function updateIds(field, id1, id2) {
            field.attr("id", 'field-' + id2);
            field.find("*[data-field="+ id1 +"]").attr("data-field", id2);
            field.find(".options-"+ id1).attr("class", "options-"+ id2);
            field.find("input,select").each(function() {
                var newName = $(this).attr('name').replace(/field\[[0-9]+\]\[(.+)\]/g,"field["+ id2 +"][$1]");
                $(this).attr('name',newName);
                if ($(this).attr('id'))
                    $(this).attr('id',newName);
            });
            field.find("label").each(function() {
                if ($(this).attr('for')) {
                    var newName = $(this).attr('for').replace(/field\[[0-9]+\]\[(.+)\]/g, "field[" + id2 + "][$1]");
                    $(this).attr('for', newName);
                }
            });
            field.find(".field-number").text(id2);
        }

        function switchIds(id1,id2) {
            var thefield = $('#field-' + id1);
            var fieldBefore = $('#field-' + id2);

            if (id1 < id2)
                fieldBefore.after(thefield);
            else
                fieldBefore.before(thefield);

            updateIds(thefield, id1,id2);
            updateIds(fieldBefore, id2,id1);
        }


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

        $(function() {
            $('div[id^="field-"]').draggable(DraggableArgs);
        });
    });

</script>