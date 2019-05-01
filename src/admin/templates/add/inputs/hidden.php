<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- placeholder -->.+<!-- \/placeholder -->/sm','',$data);
$data = preg_replace('/<!-- HTML Elements -->.+<!-- \/HTML Elements -->/sm','',$data);
$data = preg_replace('/<!-- Label Group -->.+<!-- \/Label Group -->/sm','',$data);
$data = preg_replace('/<!-- Validations Group -->.+<!-- \/Validations Group -->/sm','',$data);

echo $data;