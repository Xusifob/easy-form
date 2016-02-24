<?php

if (!function_exists('curl_init') || !function_exists('curl_exec')) {
    die('cUrl is not vailable in you PHP server.');
}


if (is_dir(__DIR__ . '/vendor'))
    require __DIR__ . '/vendor/autoload.php';
else { ?>

    <div class="panel-wordpress">
        <p><?php _e('Pour lancer les tests, installer les dépendences via composer', 'easy-form'); ?></p>
        <pre>cd wp-content/plugins/easy-form/tests/

composer install</pre>
        <p><?php _e('Pour voir comment installer composer, regardez la documentation :  <a target="_blank" href="https://getcomposer.org/">https://getcomposer.org/</a>', 'easy-form'); ?></p>
    </div>
    <?php die();
}


$cookieFile = __DIR__ . '/cookie.txt';

ob_start();
if (!is_file($cookieFile))
    touch($cookieFile);
ob_clean();
if (!is_writable($cookieFile)) { ?>
    <div class="panel-wordpress">
        <?php _e('Erreur à la création du fichier de cookie, vérifiez que vous avec les droits et les permissions', 'easy-form'); ?>
    </div>
    <?php die();
}

file_get_contents($cookieFile);




define('FORM_ADDRESS',admin_url('admin-ajax.php') . '?action=form_test');

require_once 'functions.php';


