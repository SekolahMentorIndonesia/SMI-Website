<?php
include_once '../config/cors.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Destroy session
session_unset();
session_destroy();

http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Logout successful."
]);
?>
