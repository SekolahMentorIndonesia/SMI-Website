<?php
include_once '../middleware/role-check.php';
include_once '../config/database.php';

// Require at least admin role
requireAdmin();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id_peserta) && !empty($data->status_baru)) {
    $id = $data->id_peserta;
    $status_baru = $data->status_baru;

    // Validate status value
    $allowed_status = ['pending', 'lunas', 'ditolak'];
    if (!in_array($status_baru, $allowed_status)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Status tidak valid. Gunakan: pending, lunas, atau ditolak."
        ]);
        exit();
    }

    // Check current status
    $check_query = "SELECT status FROM peserta WHERE id = :id";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(":id", $id);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        $row = $check_stmt->fetch(PDO::FETCH_ASSOC);
        $current_status = $row['status'];

        // Rule: If current status is 'lunas', prevent change
        if ($current_status === 'lunas') {
            http_response_code(403);
            echo json_encode([
                "status" => "error",
                "message" => "Status 'lunas' bersifat permanen dan tidak dapat diubah lagi."
            ]);
            exit();
        }

        // Proceed update
        $update_query = "UPDATE peserta SET status = :status WHERE id = :id";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bindParam(":status", $status_baru);
        $update_stmt->bindParam(":id", $id);

        if ($update_stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Status berhasil diperbarui menjadi '$status_baru'."
            ]);
        } else {
            http_response_code(503);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal memperbarui status."
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
        "message" => "ID peserta dan status baru wajib diisi."
    ]);
}
?>
