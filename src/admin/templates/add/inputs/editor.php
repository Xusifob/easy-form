<?php

ob_start();
include  __DIR__ . '/text.php';
$data = ob_get_clean();

$data = preg_replace('/<!-- AutoComplete -->.+<!-- \/AutoComplete -->/sm','',$data);
$data = preg_replace('/<!-- ID -->.+<!-- \/ID -->/sm','',$data);


echo $data;