<div class="row">
    <div class="col-sm-4">
        <label for="form-send-role">Role</label>
        <select name="form-send-role" id="form-send-role" class="form-control">
            <?php foreach($roles as $role){ ?>
                <option <?php echo (isset($formSendArgs[0]['role']) && $formSendArgs[0]['role'] == $role['slug'] ) ? 'selected' : ''; ?> value="<?php echo $role['slug']; ?>"><?php echo $role['name']; ?></option>
            <?php } ?>
        </select>
    </div>
    <div class="col-sm-4">
        <br>
        <input type="checkbox" name="form-connexion-user" id="form-connexion-user">
        <label for="form-connexion-user" class="label-checkbox">Connecter l'utilisateur à l\'inscription</label>
    </div>
</div>