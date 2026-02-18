<?php
include_once '../middleware/role-check.php';
include_once '../config/database.php';

// Require superadmin role for deletion
requireSuperAdmin();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $id = $data->id;

    // Check if participant exists
    $check_query = "SELECT id FROM peserta WHERE id = :id";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":id", $id);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        // Proceed delete
        $delete_query = "DELETE FROM peserta WHERE id = :id";
        $delete_stmt = $conn->prepare($delete_query);
        $delete_stmt->bindParam(":id", $id);

        if ($delete_stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Peserta berhasil dihapus permanen."
            ]);
        } else {
            http_response_code(503);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal menghapus peserta."
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Peserta tidak ditemukan."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "ID peserta wajib diisi."
    ]);
}
?>
