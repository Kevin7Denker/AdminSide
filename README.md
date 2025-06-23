# 🛠️ AdminSide API

**AdminSide** é uma API RESTful desenvolvida em **PHP** com autenticação JWT, que permite operações de **login**, **cadastro**, **edição**, **listagem** e **remoção** de registros, além de gerenciamento de usuários. Foi projetada para servir de backend para dashboards administrativos.

---

## 🚀 Tecnologias Utilizadas

- PHP 8+
- MySQL
- Firebase JWT (Auth)
- PDO (MySQL)
- CORS Headers
- Typescript + React (Frontend)

---

## 📦 Instalação e Execução

### 🔧 Pré-requisitos

- PHP 8 ou superior
- Composer
- MySQL

### 🔥 Instalação

1. Clone o projeto:

```bash
git clone https://github.com/seu-usuario/adminside.git
cd adminside
```

2. Instale as dependências:

```bash
composer install
```

3. Configure o banco de dados no arquivo `index.php` na classe `Database`:

```php
private $host = "localhost";
private $db_name = "adminside";
private $username = "root";
private $password = "";
```

4. Crie o banco de dados e execute o SQL abaixo:

```sql
CREATE DATABASE adminside;
USE adminside;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE minha_tabela (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL
);
```

5. (Opcional) Crie um usuário manualmente:

```sql
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2y$10$EXEMPLODEHASHGERADOCOMPASSWORD_HASH');
```

> ⚠️ Gere o hash usando PHP:

```php
echo password_hash('sua_senha', PASSWORD_DEFAULT);
```

---

## 🔐 Variáveis de Ambiente (Opcional)

Se quiser utilizar variáveis de ambiente, adicione um arquivo `.env`:

```
SECRET=seu_segredo_super_secreto
DB_HOST=localhost
DB_NAME=adminside
DB_USER=root
DB_PASS=
```

E carregue com a biblioteca `vlucas/phpdotenv`.

---

## 🚦 Endpoints

### 🔑 **Autenticação**

- **POST `/login`**  
  Login de usuário.  
  Payload:

```json
{
  "username": "admin",
  "password": "senha"
}
```

Resposta:

```json
{
  "message": "Login bem-sucedido",
  "token": "JWT_TOKEN"
}
```

---

### 👥 **Usuários**

- **GET `/users`**  
  🔒 Requer JWT.  
  Lista os usuários.

---

### 📄 **Registros (minha_tabela)**

- **GET `/`**  
  🔒 Lista registros.

- **POST `/`**  
  🔒 Cria novo registro.  
  Payload:

```json
{
  "nome": "João",
  "email": "joao@email.com"
}
```

- **PUT `/`**  
  🔒 Atualiza um registro.  
  Payload:

```json
{
  "id": 1,
  "nome": "João Atualizado",
  "email": "joao@email.com"
}
```

- **DELETE `/`**  
  🔒 Deleta um registro.  
  Payload:

```json
{
  "id": 1
}
```

---

## 🔒 Autenticação

- Utilize JWT no header `Authorization`:

```
Authorization: Bearer SEU_TOKEN
```

---

## 🖥️ Frontend

O frontend é desenvolvido em **React + Typescript** com Styled Components, contendo:

- Tela de login;
- Dashboard com CRUD completo;
- Logout com limpeza do token.

---

## 🚀 Rodando localmente

1. Execute o PHP localmente:

```bash
php -S localhost:8000
```

2. Acesse:

```
http://localhost:8000
```

---

## 🐛 Problemas comuns

- 🔥 **CORS bloqueando?**  
  Os headers já estão configurados:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
```

- 🔑 **Token inválido?**  
  Verifique se o token está no header:

```
Authorization: Bearer SEU_TOKEN
```

- ⚙️ **Banco não conecta?**  
  Confirme credenciais e se o MySQL está rodando.

---

## 🤝 Contribuição

Sinta-se livre para abrir **issues**, enviar **pull requests** ou sugerir melhorias!

---

## 📜 Licença

MIT © 2025 — AdminSide
