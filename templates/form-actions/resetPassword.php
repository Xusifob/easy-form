<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="row form-group">
    <div class="col-sm-4">
        <label for="form-reset-action"><?php _e('Type de réintialisation', 'easy-form'); ?></label>
        <select name="form-reset-action" class="form-control" id="form-reset-action">
            <option value="reset-password-email"><?php _e('Réinitialise le mot de passe dans un e-mail', 'easy-form'); ?></option>
            <option value="link-password-email"><?php _e('Envoi par e-mail un lien de récupération du mot de passe', 'easy-form'); ?></option>
        </select>
    </div>
</div>
<div class="row form-group">
    <div class="col-sm-4">
        <label for="form-send-subject"><?php _e('Objet', 'easy-form'); ?></label>
        <input type="text" name="form-send-subject" id="form-send-subject" SubjectValue placeholder="<?php _e('Objet', 'easy-form'); ?>" class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-senderEmail"><?php _e('Email de l\'expéditeur', 'easy-form'); ?></label>
        <input type="email" name="form-send-senderEmail" id="form-send-senderEmail" placeholder="<?php _e('Email expéditeur', 'easy-form'); ?>" senderEmailValue class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-senderName"><?php _e('Nom de l\'expéditeur', 'easy-form'); ?></label>
        <input type="text" name="form-send-senderName" id="form-send-senderName" placeholder="<?php _e('Nom du expéditeur', 'easy-form'); ?>" SenderNameValue  class="form-control"/>
    </div>
</div>

<div id="reset-password-email">
    <div class="row form-group">
        <div class="col-sm-12">
            <label for="form-send-message"><?php _e('<?php _e(\'\', \'easy-form\'); ?>', 'easy-form'); ?></label>
            <p class="infos"><?php _e('Utilisez %PASSWORD% à la place du mot de passe et %ID% pour l\'identifiant de l\'utilisateur', 'easy-form'); ?></p>
            <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" MessageValue placeholder="<?php _e('Message (texte brut ou HTML)', 'easy-form'); ?>"></textarea>
            <p class="infos"><?php _e('Vous pouvez aussi créer un fichier EasyFormTemplates/resetPassword.php dans votre thème en copiant celui du plugin', 'easy-form'); ?></p>
        </div>
    </div>
</div>


<div id="link-password-email">
    <div class="row form-group">
        <div class="col-sm-12">
            <label for="form-send-message"><?php _e('Message', 'easy-form'); ?></label>
            <p class="infos"><?php _e('Utilisez %LIEN% pour le lien vers la page de récupération  et %ID% pour l\'identifiant de l\'utilisateur', 'easy-form'); ?></p>
            <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" MessageValue placeholder="<?php _e('Message (texte brut ou HTML)', 'easy-form'); ?>"></textarea>
            <p class="infos"><?php _e('Vous pouvez aussi créer un fichier EasyFormTemplates/retrievePassword.php dans votre thème en copiant celui du plugin', 'easy-form'); ?></p>
        </div>
    </div>

    <div class="row form-group">
        <div class="col-sm-6">
            <label for="form-send-page-id"><?php _e('Id de la page de récupération de mot de passe', 'easy-form'); ?></label>
            <input type="text" name="form-send-page-id" id="form-send-page-id" PageValue placeholder="<?php _e('Id de la page de récupération', 'easy-form'); ?>" class="form-control"/>
        </div>
        <div class="col-sm-6">
            <label for="form-send-submit-value"><?php _e('Value du bouton submit sur la page de récupération', 'easy-form'); ?></label>
            <input type="text" name="form-send-submit-value" id="form-send-submit-value" submitValue placeholder="<?php _e('Value du bouton submit', 'easy-form'); ?>" class="form-control"/>
        </div>
    </div>
</div>