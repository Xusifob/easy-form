<?php
define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../../wp-load.php');

$roles = FormPlugin::GetAllRoles();
?>
<div class="row">
    <div class="col-sm-4">
        <label for="form-send-role">Role</label>
        <select name="form-send-role" id="form-send-role" class="form-control">
            <?php foreach($roles as $role){ ?>
                <option value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
            <?php } ?>
            <option value="current">Rôle actuel</option>
        </select>
    </div>
    <div class="col-sm-4">
        <br>
        <input type="checkbox" name="form-connexion-user" ConnectUserChecked id="form-connexion-user">
        <label for="form-connexion-user" class="label-checkbox"  >Connecter l'utilisateur à l'inscription</label>
    </div>
    <div class="col-sm-4">
        <br>
        <input type="checkbox" name="form-email-user" EmailUserChecked id="form-email-user">
        <label for="form-email-user" class="label-checkbox">Activer l'inscription par e-mail</label>
    </div>
</div>