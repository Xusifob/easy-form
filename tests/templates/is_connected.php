<?php
include __DIR__ . '/../header.php';
echo json_encode(['is_connected' => is_user_logged_in()]);