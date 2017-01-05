<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="ef-input">
    <label for="form-send-subject"><?php _e('Subject',EF_get_domain()); ?></label>
    <input type="text" name="form-send-subject" id="form-send-subject" placeholder="<?php _e('Subject',EF_get_domain()); ?>" class="form-control"/>
</div>
<div class="ef-input">
    <label for="form-send-recipientEmail"><?php _e('Recipient Email',EF_get_domain()); ?></label>
    <input type="email" name="form-send-recipientEmail" id="form-send-recipientEmail" placeholder="<?php _e('Recipient Email',EF_get_domain()); ?>" class="form-control"/>
</div>
<div class="ef-input">
    <label for="form-send-recipientName"><?php _e('Recipient Name',EF_get_domain()); ?></label>
    <input type="email" name="form-send-recipientEmail" id="form-send-recipientName" placeholder="<?php _e('Recipient Name',EF_get_domain()); ?>" class="form-control"/>
</div>