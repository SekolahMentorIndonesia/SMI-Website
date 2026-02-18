<?php
// Disable error reporting to prevent output corruption
error_reporting(0);
ini_set('display_errors', 0);

// Include role check
include_once '../middleware/role-check.php';

// Require at least admin role
requireAdmin();

// Clear any previous output buffer
if (ob_get_level()) {
    ob_end_clean();
}

include_once '../config/database.php';

// Set filename
$filename = "Laporan_Peserta_SMI_" . date('d-m-Y') . ".xls";

// Set headers for Excel (HTML Table format)
header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Pragma: no-cache");
header("Expires: 0");

// Fetch Data
$query = "SELECT id, nama_lengkap, email, whatsapp, program, status, created_at FROM peserta ORDER BY created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Helper function for status color
function getStatusColor($status) {
    switch (strtolower($status)) {
        case 'lunas': return '#d1e7dd'; // Light Green
        case 'ditolak': return '#f8d7da'; // Light Red
        case 'pending': return '#fff3cd'; // Light Yellow
        default: return '#ffffff';
    }
}

function getStatusTextColor($status) {
    switch (strtolower($status)) {
        case 'lunas': return '#0f5132'; // Dark Green
        case 'ditolak': return '#842029'; // Dark Red
        case 'pending': return '#664d03'; // Dark Yellow
        default: return '#000000';
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
        th { 
            background-color: #e2e3e5; /* Light Gray */
            color: #000; 
            font-weight: bold; 
            text-align: center; 
            border: 1px solid #000; 
            padding: 10px;
            vertical-align: middle;
        }
        td { 
            border: 1px solid #000; 
            padding: 8px; 
            vertical-align: middle;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th width="50">No</th>
                <th width="200">Nama Lengkap</th>
                <th width="250">Email</th>
                <th width="150">WhatsApp</th>
                <th width="150">Program</th>
                <th width="150">Status Pembayaran</th>
                <th width="150">Tanggal Daftar</th>
            </tr>
        </thead>
        <tbody>
            <?php 
            $no = 1;
            foreach ($data as $row): 
                $statusBg = getStatusColor($row['status']);
                $statusText = getStatusTextColor($row['status']);
                $tanggal = date('d-m-Y H:i', strtotime($row['created_at']));
            ?>
            <tr>
                <td class="text-center"><?= $no++ ?></td>
                <td class="text-left"><?= htmlspecialchars($row['nama_lengkap']) ?></td>
                <td class="text-left"><?= htmlspecialchars($row['email']) ?></td>
                <td class="text-center" style="mso-number-format:'\@'"><?= htmlspecialchars($row['whatsapp']) ?></td>
                <td class="text-center"><?= htmlspecialchars($row['program']) ?></td>
                <td class="text-center" style="background-color: <?= $statusBg ?>; color: <?= $statusText ?>; font-weight: bold;">
                    <?= strtoupper(htmlspecialchars($row['status'])) ?>
                </td>
                <td class="text-center"><?= $tanggal ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
