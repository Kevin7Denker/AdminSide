/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import api from "../../Repository/repository";

interface LoginProps {
  setAuth: (auth: boolean) => void;
}

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap');
  body {
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    background: #f5f6fa;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f6fa 100%);
`;

const LoginBox = styled.div`
  background: #fff;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(64, 120, 192, 0.12);
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.1rem;
  font-weight: 700;
  color: #305a8c;

  letter-spacing: 1px;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  text-align: center;
`;

const Error = styled.p`
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.85rem 1.1rem;
  border: 1.5px solid #dcdde1;
  border-radius: 8px;
  font-size: 1.05rem;
  outline: none;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  background: #f8fafc;
  transition: border 0.2s, box-shadow 0.2s;
`;

const Button = styled.button`
  padding: 0.85rem 1.1rem;
  background: linear-gradient(90deg, #4078c0 60%, #305a8c 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  box-shadow: 0 2px 8px rgba(64, 120, 192, 0.08);
  transition: background 1s, transform 0.1s;
  &:hover {
    transform: scale(1.05);
  }
`;

function Login({ setAuth }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setAuth(true);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Erro ao fazer login");
      } else {
        setError("Erro de conexão");
      }
      setAuth(false);
    }
  };

  return (
    <>
      <GlobalStyle />

      <Container>
        <LoginBox>
          <Title>Login</Title>
          {error && <Error>{error}</Error>}
          <StyledForm onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Entrar</Button>
          </StyledForm>
        </LoginBox>
      </Container>
    </>
  );
}

export default Login;
