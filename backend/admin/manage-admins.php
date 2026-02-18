<?php
include_once '../middleware/role-check.php';

// Require superadmin role
requireSuperAdmin();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all admin accounts
        try {
            $query = "SELECT id, username, role, created_at FROM admins ORDER BY created_at DESC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Admin accounts retrieved successfully.",
                "admins" => $admins
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        // Create new admin account
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->username) && !empty($data->password) && !empty($data->role)) {
            try {
                $query = "INSERT INTO admins (username, password, role) VALUES (:username, :password, :role)";
                $stmt = $conn->prepare($query);
                
                $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
                
                $stmt->bindParam(":username", $data->username);
                $stmt->bindParam(":password", $hashed_password);
                $stmt->bindParam(":role", $data->role);
                
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Admin account created successfully."
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Failed to create admin account."
                    ]);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => "Database error: " . $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Incomplete data. Username, password, and role required."
            ]);
        }
        break;

    case 'PUT':
        // Update admin account
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            try {
                $query = "UPDATE admins SET ";
                $params = [];
                
                if (!empty($data->username)) {
                    $query .= "username = :username, ";
                    $params[':username'] = $data->username;
                }
                
                if (!empty($data->password)) {
                    $query .= "password = :password, ";
                    $params[':password'] = password_hash($data->password, PASSWORD_DEFAULT);
                }
                
                if (!empty($data->role)) {
                    $query .= "role = :role, ";
                    $params[':role'] = $data->role;
                }
                
                $query = rtrim($query, ", ");
                $query .= " WHERE id = :id";
                $params[':id'] = $data->id;
                
                $stmt = $conn->prepare($query);
                
                foreach ($params as $key => $value) {
                    $stmt->bindValue($key, $value);
                }
                
                if ($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Admin account updated successfully."
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Failed to update admin account."
                    ]);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => "Database error: " . $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Admin ID required."
            ]);
        }
        break;

    case 'DELETE':
        // Delete admin account
        $admin_id = isset($_GET['id']) ? $_GET['id'] : '';
        
        if (!empty($admin_id)) {
            try {
                // Prevent deletion of self
                if ($admin_id == $_SESSION['admin_id']) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Cannot delete your own account."
                    ]);
                    break;
                }
                
                $query = "DELETE FROM admins WHERE id = :id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(":id", $admin_id);
                
                if ($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Admin account deleted successfully."
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Failed to delete admin account."
                    ]);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => "Database error: " . $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Admin ID required."
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            "status" => "error",
            "message" => "Method not allowed."
        ]);
        break;
}
?>
