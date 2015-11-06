<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');


?><div class="row form-group">
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
<div class="row form-group">
    <div class="col-sm-12">
        <label for="form-send-message">Message</label>
        <p class="infos">Utilisez %PASSWORD% à la place du mot de passe et %ID% pour l'identifiant de l'utilisateur</p>
        <textarea name="form-send-message" id="form-send-message" cols="30" rows="10" MessageValue placeholder="Message (texte brut ou HTML)"></textarea>
    </div>
</div>