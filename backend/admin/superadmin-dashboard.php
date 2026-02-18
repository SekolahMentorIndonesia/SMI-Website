<?php
include_once '../middleware/role-check.php';

// Require superadmin role
requireSuperAdmin();

// Get dashboard data for superadmin
try {
    // Get peserta statistics
    $query = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'lunas' THEN 1 ELSE 0 END) as lunas,
                SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
              FROM peserta";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get recent peserta (last 10)
    $query = "SELECT id, nama_lengkap, email, whatsapp, program, status, created_at 
              FROM peserta 
              ORDER BY created_at DESC 
              LIMIT 10";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $recent_peserta = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all admin accounts (superadmin feature)
    $query = "SELECT id, username, role, created_at FROM admins ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $admin_accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Superadmin dashboard data retrieved successfully.",
        "user" => [
            "username" => $_SESSION['admin_username'],
            "role" => $_SESSION['admin_role']
        ],
        "statistics" => $stats,
        "recent_peserta" => $recent_peserta,
        "admin_accounts" => $admin_accounts,
        "superadmin_features" => [
            "manage_admins" => true,
            "view_all_data" => true,
            "system_settings" => true
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
