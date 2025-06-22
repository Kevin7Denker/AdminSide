<?php
$password = 'senha123';
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
echo "Senha original: " . $password . "\n";
echo "Hash gerado: " . $hashed_password . "\n";
?>