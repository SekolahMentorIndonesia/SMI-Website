<?php
include_once '../config/cors.php';
include_once '../config/database.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized. Please login."
    ]);
    exit;
}

// Check role function
function requireRole($required_role) {
    if (!isset($_SESSION['admin_role']) || $_SESSION['admin_role'] !== $required_role) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Access denied. Insufficient privileges."
        ]);
        exit;
    }
}

// Check if user is at least admin (admin or superadmin)
function requireAdmin() {
    if (!isset($_SESSION['admin_role']) || !in_array($_SESSION['admin_role'], ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Access denied. Admin privileges required."
        ]);
        exit;
    }
}

// Check if user is superadmin
function requireSuperAdmin() {
    requireRole('superadmin');
}
?>
