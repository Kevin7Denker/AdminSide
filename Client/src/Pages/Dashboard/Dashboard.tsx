/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import api from "../../Repository/repository";

type DashboardProps = {
  setAuth: (auth: boolean) => void;
};

type Dado = {
  id: number;
  nome: string;
  email: string;
};

const GlobalStyle = createGlobalStyle`
  body {
    background: #f5f6fa;
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
  }
`;

const Container = styled.div`
  padding: 32px;
  background: #f5f6fa;

  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #222;
`;

const Button = styled.button`
  margin-right: 8px;
  padding: 10px 22px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background: #1565c0;
  }
`;

const DangerButton = styled(Button)`
  background: #d32f2f;
  &:hover {
    background: #b71c1c;
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-top: 24px;
  padding: 24px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const Th = styled.th`
  background: #f5f6fa;
  padding: 12px 8px;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 700;
  color: #333;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const Td = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  color: #444;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 36px 28px;
  border-radius: 12px;
  min-width: 340px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.13);
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const ErrorMsg = styled.p`
  color: #d32f2f;
  margin-bottom: 16px;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 18px;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  font-size: 1rem;
`;

function Dashboard({ setAuth }: DashboardProps) {
  const [dados, setDados] = useState<Dado[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDados = async () => {
    try {
      const response = await api.get("/");
      setDados(response.data);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Erro ao carregar dados");
      } else {
        setError("Erro de conexão");
      }
      setAuth(false);
    }
  };

  useEffect(() => {
    fetchDados();
    // eslint-disable-next-line
  }, []);

  const openCreateModal = () => {
    setIdEdit(null);
    setNome("");
    setEmail("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item: Dado) => {
    setIdEdit(item.id);
    setNome(item.nome);
    setEmail(item.email);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (idEdit) {
        await api.put("/", { id: idEdit, nome, email });
      } else {
        await api.post("/", { nome, email });
      }
      setModalOpen(false);
      fetchDados();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao salvar");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Deseja deletar?")) {
      try {
        await api.delete("/", { data: { id } });
        fetchDados();
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao deletar");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Dashboard</Title>
        <Button onClick={logout}>Logout</Button>
        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Button onClick={openCreateModal}>Adicionar Novo</Button>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.nome}</Td>
                  <Td>{item.email}</Td>
                  <Td>
                    <Button onClick={() => openEditModal(item)}>Editar</Button>
                    <DangerButton onClick={() => handleDelete(item.id)}>
                      Deletar
                    </DangerButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {modalOpen && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                {idEdit ? "Editar Registro" : "Adicionar Registro"}
              </h3>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" style={{ marginRight: 10 }}>
                  {idEdit ? "Atualizar" : "Adicionar"}
                </Button>
                <Button type="button" onClick={closeModal}>
                  Cancelar
                </Button>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
