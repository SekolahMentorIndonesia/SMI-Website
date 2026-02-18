<?php
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "status" => "success",
    "message" => "SMI Backend MVP is running.",
    "version" => "1.0.0",
    "endpoints" => [
        "auth_login" => "/auth/login.php (POST)",
        "auth_logout" => "/auth/logout.php (GET/POST)",
        "admin_dashboard" => "/admin/admin-dashboard.php (GET) - Admin & Superadmin",
        "superadmin_dashboard" => "/admin/superadmin-dashboard.php (GET) - Superadmin only",
        "admin_get_peserta" => "/admin/get-peserta.php (GET) - Admin & Superadmin",
        "admin_update_status" => "/admin/update-status.php (POST) - Admin & Superadmin",
        "admin_export_excel" => "/admin/export-excel.php (GET) - Admin & Superadmin",
        "admin_delete_peserta" => "/admin/delete-peserta.php (DELETE) - Superadmin only",
        "admin_manage_admins" => "/admin/manage-admins.php (GET/POST/PUT/DELETE) - Superadmin only",
        "program_submit" => "/program/submit.php (POST)"
    ],
    "accounts" => [
        "superadmin1" => "Superadmin access",
        "superadmin2" => "Superadmin access", 
        "superadmin3" => "Superadmin access",
        "admin" => "Admin access"
    ]
]);
?>
