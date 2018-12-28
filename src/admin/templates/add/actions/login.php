<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>

<div class="ef-input">
    <label for="settings[form-send-remember]" class="label-checkbox">
        <input type="checkbox" name="settings[form-send-remember]" id="settings[form-send-remember]" value="1"/>
        <?php _e('Remember the user',EF_get_domain()); ?>
    </label>
</div>