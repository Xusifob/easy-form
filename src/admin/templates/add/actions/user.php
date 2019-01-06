<?php $roles = EF_User_Form::get_all_roles(); ?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>

<div class="ef-input">
    <label for="settings[role]"><?php _e('Role',EF_get_domain()); ?></label>
    <select name="settings[role]" id="settings[role]" class="form-control">
        <?php foreach($roles as $role){ ?>
            <option value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
        <?php } ?>
        <option value="current"><?php _e('Rôle actuel',EF_get_domain()); ?></option>
    </select>
</div>
<div class="ef-input">
    <label for="settings[connexion-user]" class="label-checkbox">
        <input type="checkbox" name="settings[connexion-user]"  id="settings[connexion-user]">
        <?php _e('Login the user when register', EF_get_domain()); ?>
    </label>
</div>
<div class="ef-input">
    <label for="settings[activation-via-email]" class="label-checkbox">
        <input type="checkbox" name="settings[activation-via-email]"  id="settings[activation-via-email]">
        <?php _e('Activate user through email',  EF_get_domain()); ?>
    </label>
</div>