<?php
include_once '../middleware/role-check.php';
include_once '../config/database.php';

// Require at least admin role
requireAdmin();

// Fetch all participants
$query = "SELECT id, nama_lengkap, email, whatsapp, program, catatan, status, created_at FROM peserta ORDER BY created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $peserta_arr = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $peserta_item = [
            "id" => $id,
            "nama_lengkap" => $nama_lengkap,
            "email" => $email,
            "whatsapp" => $whatsapp,
            "program" => $program,
            "catatan" => $catatan,
            "status" => $status,
            "tanggal_daftar" => $created_at
        ];
        array_push($peserta_arr, $peserta_item);
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data" => $peserta_arr
    ]);
} else {
    http_response_code(200); // Still 200 OK, just empty data
    echo json_encode([
        "status" => "success",
        "data" => [],
        "message" => "Tidak ada data peserta."
    ]);
}
?>
