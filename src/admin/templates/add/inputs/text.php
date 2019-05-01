<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<table class="ef-table options-fieldId" id="options-fieldId" style="display: none">
    <!-- Values Group -->
    <tr class="ef-table--separator">
        <td class="ef-rules">
            <h4><?php _e('Values','easy-form'); ?></h4>
            <p><?php _e('This part will regroup the values displayed in your form','easy-form'); ?></p>
        </td>
        <td class="ef-table-content">
            <!-- placeholder -->
            <div class="ef-input">
                <label for="field[fieldId][attributes][placeholder]"><?php _e('Placeholder', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][attributes][placeholder]" name="field[fieldId][attributes][placeholder]" class="form-control" placeholder="<?php _e('Placeholder','easy-form'); ?>"/>
            </div>
            <!-- /placeholder -->
            <!-- value -->
            <div class="ef-input ef-input--value">
                <label for="field[fieldId][attributes][value]"><?php _e('Value', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][attributes][value]" name="field[fieldId][attributes][value]" class="form-control" placeholder="<?php _e('Value','easy-form'); ?>"/>
            </div>
            <!-- /value -->
            <!-- Values -->
        </td>
    </tr>
    <!-- /Values Group -->


    <!-- HTML Elements -->
    <tr class="ef-table--separator" advanced >
        <td class="ef-rules">
            <h4><?php _e('HTML Elements','easy-form'); ?></h4>
            <p><?php _e('This part will regroup all the information linked to the &lt;input&gt; html element','easy-form'); ?></p>
        </td>
        <td class="ef-table-content" >
            <!-- HTML -->
            <!-- ID -->
            <div class="ef-input">
                <label for="field[fieldId][attributes][id]"><?php _e('id', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][attributes][id]" name="field[fieldId][attributes][id]" class="form-control" placeholder="<?php _e('Id of the input','easy-form'); ?>"/>
            </div>
            <!-- /ID -->
            <div class="ef-input" advanced >
                <label for="field[fieldId][attributes][class]"><?php _e('class', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][attributes][class]" name="field[fieldId][attributes][class]" class="form-control" placeholder="<?php _e('class of the input','easy-form'); ?>"/>
            </div>
        </td>
    </tr>
    <!-- /HTML Elements -->



    <!-- Label Group -->
    <tr class="ef-table--separator">
        <td class="ef-rules">
            <h4><?php _e('Label','easy-form'); ?></h4>
            <p><?php _e('This part will regroup all the information about the label around the element','easy-form'); ?></p>
        </td>
        <td class="ef-table-content">
            <!-- Label -->
            <div class="ef-input">
                <label for="field[fieldId][settings][label]"><?php _e('Label Value', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][settings][label]" name="field[fieldId][settings][label]" class="form-control" placeholder="<?php _e('Label Value','easy-form'); ?>"/>
            </div>
            <div class="ef-input" advanced >
                <label for="field[fieldId][settings][label-class]"><?php _e('Class of the label', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][settings][label-class]" name="field[fieldId][settings][label-class]" class="form-control" placeholder="<?php _e('Class of the label','easy-form'); ?>"/>
            </div>
            <!-- Label after -->
            <div class="ef-input" advanced >
                <label for="field[fieldId][settings][label-after]" class="label-checkbox">
                    <input type="checkbox" id="field[fieldId][settings][label-after]" name="field[fieldId][settings][label-after]" value="1"/>
                    <?php _e('Display the label after the field', 'easy-form'); ?>
                </label>
            </div>
            <!-- /Label after -->
            <div class="ef-input">
                <label for="field[fieldId][settings][exp-text]"><?php _e('Explanatory text', 'easy-form'); ?></label>
                <textarea type="text" id="field[fieldId][settings][exp-text]" name="field[fieldId][settings][exp-text]" class="form-control" placeholder="<?php _e('Explainatory text','easy-form'); ?>"></textarea>
            </div>
            <div class="ef-input" advanced >
                <label for="field[fieldId][settings][exp-text-class]"><?php _e('Class of the text', 'easy-form'); ?></label>
                <input type="text" id="field[fieldId][settings][exp-text-class]" name="field[fieldId][settings][exp-text-class]" class="form-control" placeholder="<?php _e('Class of the text','easy-form'); ?>"/>
            </div>
        </td>
    </tr>
    <!-- /Label Group -->


    <!-- Validations Group -->
    <tr class="ef-table--separator">
        <td class="ef-rules">
            <h4><?php _e('Validations','easy-form'); ?></h4>
            <p><?php _e('This part will regroup all the validations around the input','easy-form'); ?></p>
        </td>
        <td class="ef-table-content">
            <!-- Required -->
            <div class="ef-input">
                <label for="field[fieldId][attributes][required]" class="label-checkbox">
                    <input type="checkbox" id="field[fieldId][attributes][required]" name="field[fieldId][attributes][required]" value="1" />
                    <?php _e('Required', 'easy-form'); ?>
                </label>
            </div>
            <!-- /Required -->
            <!-- AutoComplete -->
            <div class="ef-input" advanced >
                <label for="field[fieldId][attributes][autocomplete]" class="label-checkbox">
                    <input type="checkbox" id="field[fieldId][attributes][autocomplete]" name="field[fieldId][attributes][autocomplete]" value="1" />
                    <?php _e('AutoComplete', 'easy-form'); ?>
                </label>
            </div>
            <!-- /AutoComplete -->
            <!-- Validations -->
        </td>
    </tr>
    <!-- /Validations Group -->


    <!-- Statistics Group -->
    <tr class="ef-table--separator" advanced >
        <td class="ef-rules">
            <h4><?php _e('Statistics','easy-form'); ?></h4>
            <p><?php _e('This part will regroup all the options of the statistics','easy-form'); ?></p>
        </td>
        <td class="ef-table-content">
            <div class="ef-input">
                <label for="field[fieldId][form-sort-stats]" class="label-checkbox">
                    <input type="checkbox" id="field[fieldId][form-sort-stats]" name="field[fieldId][form-sort-stats]" value="1"/>
                    <?php _e('Filter statistics with thie field', 'easy-form'); ?>
                </label>
            </div>
            <!-- Statistics -->
        </td>
    </tr>
    <!-- /Statistics Group -->
</table>