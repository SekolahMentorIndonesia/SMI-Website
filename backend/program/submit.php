<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    !empty($data->nama_lengkap) &&
    !empty($data->email) &&
    !empty($data->whatsapp) &&
    !empty($data->program)
) {
    // Sanitize inputs
    $nama_lengkap = htmlspecialchars(strip_tags($data->nama_lengkap));
    $email = htmlspecialchars(strip_tags($data->email));
    $whatsapp = htmlspecialchars(strip_tags($data->whatsapp));
    $program = htmlspecialchars(strip_tags($data->program));
    $catatan = !empty($data->catatan) ? htmlspecialchars(strip_tags($data->catatan)) : null;
    $status = 'pending';

    $query = "INSERT INTO peserta SET 
                nama_lengkap=:nama_lengkap, 
                email=:email, 
                whatsapp=:whatsapp, 
                program=:program, 
                catatan=:catatan, 
                status=:status,
                created_at=NOW()";

    $stmt = $conn->prepare($query);

    // Bind values
    $stmt->bindParam(":nama_lengkap", $nama_lengkap);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":whatsapp", $whatsapp);
    $stmt->bindParam(":program", $program);
    $stmt->bindParam(":catatan", $catatan);
    $stmt->bindParam(":status", $status);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Pendaftaran berhasil. Silahkan tunggu konfirmasi selanjutnya."
        ]);
    } else {
        http_response_code(503);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan data."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak lengkap. Nama, email, whatsapp, dan program wajib diisi."
    ]);
}
?>
