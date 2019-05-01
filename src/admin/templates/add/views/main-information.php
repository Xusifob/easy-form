<div class="ef-content" >
    <table class="ef-table">
        <tr class="ef-table--separator" advanced >
            <td class="ef-rules">
                <h4><?php _e('HTML Elements','easy-form'); ?></h4>
                <p><?php _e('This part will regroup all the information linked to the &lt;form&gt; html element','easy-form'); ?></p>
            </td>
            <td class="ef-table-content">
                <div class="ef-input">
                    <label for="attributes[class]"><?php _e('Class of the form', 'easy-form'); ?></label>
                    <input type="text" id="attributes[class]"
                           name="attributes[class]" class="form-control"
                           placeholder="<?php _e('Class of the form', 'easy-form'); ?>"/>
                </div>


                <div class="ef-input">
                    <label for="attributes[id]"><?php _e('Id of the form', 'easy-form'); ?></label>
                    <input type="text" class="form-control" id="attributes[id]"
                           name="attributes[id]" placeholder="<?php _e('Id of the form', 'easy-form'); ?>"/>
                </div>

            </td>
        </tr>

        <tr class="ef-table--separator" advanced >
            <td class="ef-rules">
                <h4><?php _e('Field options','easy-form'); ?></h4>
                <p><?php _e('This part will regroup all the information repeated on all fields','easy-form'); ?></p>
            </td>
            <td class="ef-table-content">
                <div class="ef-input">
                    <label for="settings[default-class]"><?php _e('Default Class', 'easy-form'); ?></label>
                    <input type="text"
                           id="settings[default-class]"
                           name="settings[default-class]"
                           class="form-control"
                           placeholder="<?php _e('Field\'s default class', 'easy-form'); ?>"/>
                </div>
            </td>
        </tr>

        <tr class="ef-table--separator">
            <td class="ef-rules">
                <h4><?php _e('Errors','easy-form'); ?></h4>
                <p><?php _e('This part will regroup  how the errors will be handled in the form','easy-form'); ?></p>
            </td>
            <td class="ef-table-content">
                <div class="ef-input">
                    <label for="settings[display-errors]" class="label-checkbox">
                        <input type="checkbox" id="settings[display-errors]" name="settings[display-errors]"/>
                        <?php _e('Display the errors of every field', 'easy-form'); ?>
                    </label>
                </div>
                <div class="ef-input">
                    <label for="settings[errors-before]" class="label-checkbox">
                        <input type="checkbox" id="settings[errors-before]" name="settings[errors-before]"/>
                        <?php _e('Display errors over the field','easy-form'); ?>
                    </label>

                </div>
            </td>
        </tr>
        <tr class="ef-table--separator">
            <td class="ef-rules">
                <h4><?php _e('Success','easy-form'); ?></h4>
                <p><?php _e('This part let you define the success message to display to the user','easy-form'); ?></p>
            </td>
            <td class="ef-table-content">
                <div class="ef-input">
                    <label for="settings[success-message]"><?php _e('Success Message', 'easy-form'); ?></label>
                    <textarea class="form-control" id="settings[success-message]" name="settings[success-message]"></textarea>
                </div>
            </td>
        </tr>

    </table>
</div>
