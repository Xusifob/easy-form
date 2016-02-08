<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="row">
    <div class="col-sm-4">
        <label for="form-send-subject">Objet</label>
        <input type="text" name="form-send-subject" id="form-send-subject" placeholder="Objet" SubjectValue class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-recipientEmail">Email destinataire</label>
        <input type="email" name="form-send-recipientEmail" id="form-send-recipientEmail" placeholder="Email destinataire" recipiendEmailValue class="form-control"/>
    </div>
    <div class="col-sm-4">
        <label for="form-send-recipientName">Nom du destinataire</label>
        <input type="text" name="form-send-recipientName" id="form-send-recipientName" placeholder="Nom du destinataire" recipiendNameValue class="form-control"/>
    </div>
</div>