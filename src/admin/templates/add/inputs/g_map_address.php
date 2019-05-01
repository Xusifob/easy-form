<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);

ob_start(); ?>
	<div class="ef-input">
		<label for="field[fieldId][settings][api_key]"><?php _e('API Google Maps Places', 'easy-form'); ?></label>
        <input type="text" id="field[fieldId][settings][api_key]" placeholder="AIzaSyA1xViWbAsX8TXWcYVz62XhtGW7breRwdg" class="form-control" name="field[fieldId][settings][api_key]" />
    </div>
    <div class="ef-input">
		<label for="field[fieldId][attributes][countries]"><?php _e('Restrict the search to some countries', 'easy-form'); ?></label>
        <input type="text" id="field[fieldId][attributes][countries]" placeholder="fr,us" class="form-control" name="field[fieldId][attributes][countries]" />
        <p class="small-help"><?php _e('The name of the countries must be <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166-1 Alpha-2 country code</a> separated with a comma ",". Maximum 5 countries. More infos  <a href="https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions" target="_blank" >here</a></a>','easy-form'); ?></p>
    </div>
<?php
$validations = ob_get_clean();

$data =  str_replace('<!-- Validations -->',$validations,$data);

echo $data;