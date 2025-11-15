import {  DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { downloadExcel } from "../../utils/downloadExcel";
import { confirmDelete } from "../../utils/delete";
import { ConfigProvider, Input, Button } from "antd";
import styled from "./RefeicaoPage.module.css";
import ProTable from "@ant-design/pro-table";
import { useState, useEffect } from "react";
import ptBR from "antd/lib/locale/pt_BR";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import { Grid } from "antd";

const RefeicaoPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [keywords, setKeywords] = useState("");
  const [alimentos, setAlimentos] = useState([]);
  const usuario_id = sessionStorage.getItem("usuario_id");
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const columns = [
    { title: "DATA DE REGISTRO", dataIndex: "dataRegistro", width: 160},
    { title: "TIPO DE REFEIÇÃO", dataIndex: "tipoRefeicao", responsive: ['sm']},
    {
      title: 'AÇÕES',
      render: (_, row) => (
        screens.md ? (
            <div className={styled.botoesGrid}>
              <Button key="deletar" href={`/refeicao/${row.id}`} onClick={(e) => {e.preventDefault(confirmDelete(row.id, setAlimentos, "/refeicao/", enqueueSnackbar))}} icon={<DeleteOutlined />}>Deletar</Button>
              <Button key="editar" onClick={() => navigate(`/editar/refeicao/${row.id}`)}icon={<EditOutlined />}>Editar</Button>
            </div>
        ) : (
            <div className={styled.botoesGrid}>
              <Button key="deletar" href={`/refeicao/${row.id}`} onClick={(e) => {e.preventDefault(confirmDelete(row.id, setAlimentos, "/refeicao/", enqueueSnackbar))}} icon={<DeleteOutlined />}></Button>
              <Button key="editar" onClick={() => navigate(`/editar/refeicao/${row.id}`)}icon={<EditOutlined />}></Button>
            </div>
        )
      ), 
    },
  ];

  const filterData = (data, keywords) => {
    if (!keywords) return data;

    return data.filter(
      (item) =>
        item.dataRegistro?.toLowerCase().includes(keywords.toLowerCase()) ||
        item.pesoAtual?.toLowerCase().includes(keywords.toLowerCase())
    );
  };

  useEffect(() => {
    api.get(`/refeicoes/${usuario_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (resposta) {
        setAlimentos(resposta.data);
      })
      .catch(function (error) {
        console.error("Erro:", error);
      });
  }, []);

  return (
    <>
      <section className={styled.mainContent}>
        <header className={styled.header}>
          <h1>Refeições</h1>
          <p>{alimentos.length} Registro(s) encontrado(s)</p>
        </header>
        <div className={styled.functions}>
          <Input.Search
            style={{
              display: screens.xl ? "block" : "none"
            }} 
            className={styled.input} 
            placeholder="Procure um registro" 
            onSearch={(value) => setKeywords(value)}/>
          <div className={styled.buttons}>
            <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={() => downloadExcel('refeicoes', alimentos, enqueueSnackbar)}>
              Baixar Dados
            </Button>
            <NavLink to={"novo"}>
              <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large">
                Registro
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
      <ConfigProvider locale={ptBR}>
        <ProTable
          rowKey="id"
          size="large"
          search={false}
          bordered={true}
          columns={columns}
          dataSource={filterData(alimentos, keywords)}
          params={{ keywords }}
          pagination={{
            pageSize: 5,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </>
  );
};

export default RefeicaoPage;