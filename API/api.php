<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Carregar dependências
require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

// Conexão com banco
class Database {
    private $host = "localhost";
    private $db_name = "adminside";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        try {
            $this->conn = new PDO(
                "mysql:host=$this->host;dbname=$this->db_name;charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erro na conexão: " . $e->getMessage()]);
            exit();
        }
    }
}

//  Autenticação JWT
class Auth {
    private $key = "OLA_PROSTIRANHAS_EU_QUERO_APRESENTAR_O_MEU_AMIGUINHO_O_PINTAO";
    private $issuer = "http://localhost";
    private $audience = "http://localhost";
    private $expiration_time = 3600;

    public function generateToken($user_id, $username) {
        $issuedAt = time();
        $expire = $issuedAt + $this->expiration_time;

        $token = [
            'iss' => $this->issuer,
            'aud' => $this->audience,
            'iat' => $issuedAt,
            'exp' => $expire,
            'data' => [
                'id' => $user_id,
                'username' => $username
            ]
        ];

        return JWT::encode($token, $this->key, 'HS256');
    }

    public function validateToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(["error" => "Token não fornecido ou malformado"]);
            exit();
        }

        try {
            $jwt = $matches[1];
            $decoded = JWT::decode($jwt, new Key($this->key, 'HS256'));
            return $decoded->data;
        } catch (ExpiredException $e) {
            http_response_code(401);
            echo json_encode(["error" => "Token expirado"]);
            exit();
        } catch (SignatureInvalidException $e) {
            http_response_code(401);
            echo json_encode(["error" => "Assinatura do token inválida"]);
            exit();
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["error" => "Erro no token: " . $e->getMessage()]);
            exit();
        }
    }
}

// Inicializar
$conn = (new Database())->getConnection();
$auth = new Auth();
$request_method = $_SERVER["REQUEST_METHOD"];


//  Roteamento
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script_dir = dirname($_SERVER['SCRIPT_NAME']);
$endpoint_suffix = $request_uri;

if (strpos($endpoint_suffix, $script_dir) === 0) {
    $endpoint_suffix = substr($endpoint_suffix, strlen($script_dir));
}

$endpoint_suffix = ltrim($endpoint_suffix, '/');
$route_parts = explode('/', $endpoint_suffix);
$action = $route_parts[0] ?? '';

$is_protected_route = false;

if (in_array($request_method, ['POST', 'PUT', 'DELETE']) && $action !== 'login') {
    $is_protected_route = true;
}

if ($request_method === 'GET' && in_array($action, ['users'])) {
    $is_protected_route = true;
}

if ($is_protected_route) {
    $user_data = $auth->validateToken();
}

//  Switch de métodos
switch ($request_method) {
    case 'GET':
        if ($action === 'users') {
            $stmt = $conn->prepare("SELECT id, username FROM users");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $stmt = $conn->prepare("SELECT * FROM minha_tabela");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if ($action === 'login') {
            if (empty($data['username']) || empty($data['password'])) {
                http_response_code(400);
                echo json_encode(["error" => "Username e senha são obrigatórios"]);
                exit();
            }

            $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = :username LIMIT 1");
            $stmt->bindParam(':username', $data['username']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($data['password'], $user['password_hash'])) {
                $token = $auth->generateToken($user['id'], $user['username']);
                echo json_encode(["message" => "Login bem-sucedido", "token" => $token]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Username ou senha inválidos"]);
            }

        } else {
            if (empty($data['nome']) || empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(["error" => "Nome e email válido são obrigatórios"]);
                exit();
            }

            $stmt = $conn->prepare("INSERT INTO minha_tabela (nome, email) VALUES (:nome, :email)");
            $stmt->bindParam(':nome', $data['nome']);
            $stmt->bindParam(':email', $data['email']);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Registro inserido com sucesso"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Falha ao inserir"]);
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['id']) || empty($data['nome']) || empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["error" => "ID, nome e email válido são obrigatórios"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE minha_tabela SET nome = :nome, email = :email WHERE id = :id");
        $stmt->bindParam(':nome', $data['nome']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount()) {
                echo json_encode(["message" => "Registro atualizado com sucesso"]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Registro não encontrado"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Falha ao atualizar"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID é obrigatório"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM minha_tabela WHERE id = :id");
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount()) {
                echo json_encode(["message" => "Registro deletado com sucesso"]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Registro não encontrado"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Falha ao deletar"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método não permitido"]);
        break;
}
?>