<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

ob_start(); ?>
    <div class="ef-input">
        <label for="field[fieldId][attributes][format]"><?php _e('Format', 'easy-form'); ?></label>
        <select class="form-control" name="field[fieldId][attributes][format]" id="field[fieldId][attributes][format]">
            <option value="">Aucun format</option>
            <option value="fr">Français (01 02 03 04 05)</option>
            <option value="en">Anglais (456 555 0559)</option>
        </select>
    </div>
<?php
$validations = ob_get_clean();

echo str_replace('<!-- Validations -->',$validations,$data);