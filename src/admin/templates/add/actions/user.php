<?php $roles = EF_User_Form::get_all_roles(); ?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>

<div class="ef-input">
    <label for="form-send-role"><?php _e('Role',EF_get_domain()); ?></label>
    <select name="form-send-role" id="form-send-role" class="form-control">
        <?php foreach($roles as $role){ ?>
            <option value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
        <?php } ?>
        <option value="current"><?php _e('Rôle actuel',EF_get_domain()); ?></option>
    </select>
</div>
<div class="ef-input">
    <label for="form-connexion-user" class="label-checkbox"  >
        <input type="checkbox" name="form-connexion-user"  id="form-connexion-user">
        <?php _e('Login the user when register', EF_get_domain()); ?>
    </label>
</div>
<div class="ef-input">
    <label for="form-email-user" class="label-checkbox">
        <input type="checkbox" name="form-email-user"  id="form-email-user">
        <?php _e('Activate user through email',  EF_get_domain()); ?>
    </label>
</div>