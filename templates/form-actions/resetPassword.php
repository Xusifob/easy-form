<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');


?>
<div class="row form-group">
    <div class="col-sm-4">
        <label for="form-reset-action">Type de réintialisation</label>
        <select name="form-reset-action" class="form-control" id="form-reset-action">
            <option value="reset-password-email">Réinitialise le mot de passe dans un e-mail</option>
            <option value="link-password-email">Envoie par e-mail un lien de récupération du mot de passe</option>
        </select>
    </div>
</div>
<div class="row form-group">
    <div class="col-sm-4">
        <label for="form-send-subject">Objet</label>
        <input type="text" name="form-send-subject" id="form-send-subject" SubjectValue placeholder="Objet" class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-senderEmail">Email de l'expéditeur</label>
        <input type="email" name="form-send-senderEmail" id="form-send-senderEmail" placeholder="Email expéditeur" senderEmailValue class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-senderName">Nom de l'expéditeur</label>
        <input type="text" name="form-send-senderName" id="form-send-senderName" placeholder="Nom du expéditeur" SenderNameValue  class="form-control"/>
    </div>
</div>

<div id="reset-password-email">
    <div class="row form-group">
        <div class="col-sm-12">
            <label for="form-send-message">Message</label>
            <p class="infos">Utilisez %PASSWORD% à la place du mot de passe et %ID% pour l'identifiant de l'utilisateur</p>
            <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" MessageValue placeholder="Message (texte brut ou HTML)"></textarea>
            <p class="infos">Vous pouvez aussi créer un fichier EasyFormTemplates/resetPassword.php dans votre thème en copiant celui du plugin</p>
        </div>
    </div>
</div>


<div id="link-password-email">
    <div class="row form-group">
        <div class="col-sm-12">
            <label for="form-send-message">Message</label>
            <p class="infos">Utilisez %LIEN% pour le lien vers la page de récupération  et %ID% pour l'identifiant de l'utilisateur</p>
            <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" MessageValue placeholder="Message (texte brut ou HTML)"></textarea>
            <p class="infos">Vous pouvez aussi créer un fichier EasyFormTemplates/retrievePassword.php dans votre thème en copiant celui du plugin</p>
        </div>
    </div>

    <div class="row form-group">
        <div class="col-sm-6">
            <label for="form-send-page-id">Id de la page de récupération de mot de passe</label>
            <input type="text" name="form-send-page-id" id="form-send-page-id" PageValue placeholder="Id de la page de récupération" class="form-control"/>
        </div>
        <div class="col-sm-6">
            <label for="form-send-submit-value">Value du bouton submit sur la page de récupération</label>
            <input type="text" name="form-send-submit-value" id="form-send-submit-value" submitValue placeholder="Value du bouton submit" class="form-control"/>
        </div>
    </div>
</div>