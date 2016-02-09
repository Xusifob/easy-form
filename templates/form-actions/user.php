<?php $roles = FormPlugin::GetAllRoles(); ?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="row">
    <div class="col-sm-4">
        <label for="form-send-role">Role</label>
        <select name="form-send-role" id="form-send-role" class="form-control">
            <?php foreach($roles as $role){ ?>
                <option value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
            <?php } ?>
            <option value="current"><?php _e('Rôle actuel', 'easy-form'); ?></option>
        </select>
    </div>
    <div class="col-sm-4">
        <br>
        <input type="checkbox" name="form-connexion-user" ConnectUserChecked id="form-connexion-user">
        <label for="form-connexion-user" class="label-checkbox"  ><?php _e('Connecter l\'utilisateur à l\'inscription', 'easy-form'); ?></label>
    </div>
    <div class="col-sm-4">
        <br>
        <input type="checkbox" name="form-email-user" EmailUserChecked id="form-email-user">
        <label for="form-email-user" class="label-checkbox"><?php _e('Activer l\'inscription par e-mail', 'easy-form'); ?></label>
    </div>
</div>