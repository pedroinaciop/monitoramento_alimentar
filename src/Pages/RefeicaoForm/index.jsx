import { parseBrazilianDateTimeToISO, formatDateTimeToISO, formatDateTimeToBrazilian } from "../../utils/formatDate";
import { unidadeAlimentoOptions, tipoRefeicaoOptions } from "../../utils/options";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from '../../Components/SelectInput';
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigProvider, Button, Modal, Grid } from "antd";
import HeaderForm from "../../Components/HeaderForm";
import FooterForm from "../../Components/FooterForm";
import InputField from "../../Components/InputField";
import styled from "./RefeicaoForm.module.css";
import ProTable from "@ant-design/pro-table";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ptBR from "antd/lib/locale/pt_BR";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import { z } from "zod";


const RefeicaoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const updateDate = new Date();
  const { enqueueSnackbar } = useSnackbar();
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [alimentos, setAlimentos] = useState([]);
  const [alimentoEditando, setAlimentoEditando] = useState(null);
  const usuarioId = sessionStorage.getItem("usuario_id");
  const inputAlimentoRef = useRef(null);
  const formattedDateTime = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const createRefeicaoFormSchema = z.object({
    dataRegistro: z.coerce.date()
    .max(updateDate, "Data futura não permitida")
    .default(new Date()),

    tipoRefeicao: z.enum(["Café da Manhã", "Lanche","Almoço", "Café da Tarde", "Jantar", "Ceia"], {
      errorMap: () => ({ message: "Campo obrigatório" }),
    }),
  });

  const createAlimentoFormSchema = z.object({
    nomeAlimento: z.string().min(1, "Campo obrigatório").max(40, "Máximo de 40 caracteres"),

    unidadeAlimento: z.enum(["Unidade","Miligramas","Gramas", "Quilos", "Mililitros", "Litros", "Copo", "Xícara", "Taça", "Fatia", "Pedaço", "Colher", "Colher de Chá", "Colher de Sopa", "Pitada"], {
      errorMap: () => ({ message: "Campo obrigatório" }),
    }),

    quantidadeAlimento: z.number(),
  });

  const alimentoForm = useForm({
    resolver: zodResolver(createAlimentoFormSchema),
  });

  const { control, register, handleSubmit, formState: { errors },  watch, reset} = useForm({
    resolver: zodResolver(createRefeicaoFormSchema),
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const filterData = (data, keywords) => {
    if (!keywords) return data;
    return data.filter(
      (item) =>
        item.dataRegistro?.toLowerCase().includes(keywords.toLowerCase()) ||
        item.tipoRefeicao?.toLowerCase().includes(keywords.toLowerCase())
    );
  };

  const columns = [
    { title: "NOME", dataIndex: "nomeAlimento", width: 200 },
    { title: "QUANT.", dataIndex: "quantidadeAlimento" },
    { title: "UNIDADE ALIMENTO", dataIndex: "unidadeAlimento", responsive: ['sm']},
    {
        title: 'AÇÕES',
        render: (_, row) => (
            screens.md ? (
                <div className={styled.botoesGrid}>
                  <Button key="editar" onClick={() => editAlimento(row.id)} icon={<EditOutlined />}>Editar</Button> 
                  <Button key="deletar" onClick={(e) => {e.preventDefault(); confirmDelete(row.id)}} icon={<DeleteOutlined />}>Deletar</Button>
                </div>
            ) : (
                <div className={styled.botoesGrid}>
                  <Button key="editar" onClick={() => editAlimento(row.id)} icon={<EditOutlined />}></Button> 
                  <Button key="deletar" onClick={(e) => {e.preventDefault(); confirmDelete(row.id)}} icon={<DeleteOutlined />}></Button>
                </div>
            )
            
        ), 
    },
  ];

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirmar exclusão",
      content: "Tem certeza que deseja deletar esse registro?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk: () => deleteAlimento(id),
    });
  };

  const deleteAlimento = (id) => {
    if (!id) {
      setAlimentos((prev) => prev.filter((item) => item.id !== id));
      enqueueSnackbar("Deletado com sucesso!", { variant: "success",anchorOrigin: { vertical: "bottom", horizontal: "right" }});
      return;
    } else {
      api.delete(`/alimento/${id}`).then(() => {
        setAlimentos((prev) => prev.filter((item) => item.id !== id));
        enqueueSnackbar("Deletado com sucesso!", {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    inputAlimentoRef.current?.blur();
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
  if (open && inputAlimentoRef.current) {
    setTimeout(() => {
      inputAlimentoRef.current.focus();
    }, 150);
  }
}, [open]);

  const createRefeicao = (data) => {
    api.post("/cadastro/refeicao/novo", {
          dataRegistro: formatDateTimeToBrazilian(data.dataRegistro),
          tipoRefeicao: data.tipoRefeicao,
          usuario: { 
            id: usuarioId ,
          },
          alimentos: alimentos.map((a) => ({
            nomeAlimento: a.nomeAlimento,
            unidadeAlimento: a.unidadeAlimento,
            quantidadeAlimento: a.quantidadeAlimento,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function () {
        enqueueSnackbar("Cadastro realizado com sucesso!", {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        navigate("/refeicao/");
      })
      .catch(function (error) {
        if (api.isAxiosError(error)) {
          if (error.response) {
            enqueueSnackbar(
              `Erro ${error.response.status}: ${error.response.data.message}`,
              { variant: "error" }
            );
          } else if (error.request) {
            enqueueSnackbar("Erro de rede: Servidor não respondeu", {
              variant: "warning",
            });
          } else {
            enqueueSnackbar("Erro desconhecido: " + error.message, {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar("Erro inesperado", { variant: "error" });
        }
      });
  };

  const editRefeicao = (data) => {
    api.put(`/editar/refeicao/${id}`, {
      id: data.id,
      dataRegistro: formatDateTimeToBrazilian(data.dataRegistro),
      tipoRefeicao: data.tipoRefeicao,
      dataAlteracao: formattedDateTime,
        alimentos: alimentos.map((a) => ({
          id: a.id,
          nomeAlimento: a.nomeAlimento,
          unidadeAlimento: a.unidadeAlimento,
          quantidadeAlimento: a.quantidadeAlimento,
        })),
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function() {
        enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
        navigate('/refeicao');
    }).catch(function(error) {
        if (api.isAxiosError(error)) {
            if (error.response) {
                enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            } else if (error.request) {
                enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            } else {
                enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            }
        } else {
            enqueueSnackbar("Erro inesperado", { variant: "error" });
        }
    })
  };

  const editAlimento = (id) => {
    const alimento = alimentos.find((a) => a.id === id);
    setAlimentoEditando(alimento);
    setOpen(true);

    setTimeout(() => {
      alimentoForm.reset(alimento);
      inputAlimentoRef.current?.focus();
    }, 150);
  };

  const handleOk = alimentoForm.handleSubmit((data) => {
    if (alimentoEditando) {
      setAlimentos((prev) =>
        prev.map((a) => (a.id === alimentoEditando.id ? { ...a, ...data } : a))
      );
      setAlimentoEditando(null);
    } else {
      setAlimentos((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setOpen(false);
    alimentoForm.reset();
  });

  useEffect(() => {
    if (id) {
        setLoading(true);
        api.get(`/refeicao/${id}`)
          .then((response) => {
            const refeicao = response.data;
            reset({
              id: refeicao.id,
              dataRegistro: parseBrazilianDateTimeToISO(refeicao.dataRegistro, 3),
              tipoRefeicao: refeicao.tipoRefeicao,
              dataAlteracao: refeicao.dataAlteracao
            });
            setAlimentos(refeicao.alimentos || []);
          })
          .catch((error) => {
            enqueueSnackbar(`Erro ao carregar medidas : ${error}`, {
              variant: "error",
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
          })
          .finally(() => setLoading(false));
      }
  }, [id]) 

  const dataAlteracaoField = watch("dataAlteracao");

  return (
    <section className={styled.appContainer}>
      <HeaderForm title={"Refeição"} />
      <form
        onSubmit={id ? handleSubmit(editRefeicao) : handleSubmit(createRefeicao)} onKeyDown={handleKeyDown} autoComplete="off">
        <section className={styled.contextForm}>
          <div className={styled.row}>
            <InputField
              idInput="dataRegistro"
              autoFocus
              idDiv={styled.dataRegistroCampo}
              label="Data de Registro*"
              type="datetime-local"
              register={register}
              defaultValue={formatDateTimeToISO(new Date())}
              readOnly={id ? true : false}
              error={errors.dataRegistro}
            />

            <SelectField
              id={styled.tipoRefeicaoCampo}
              name="tipoRefeicao"
              label="Tipo de Refeição"
              control={control}
              options={tipoRefeicaoOptions}
              placeholder="Selecione uma opção"
              required
              error={errors.tipoRefeicao}
            />
          </div>
          <p className={styled.tituloTabelaAlimentos}>Alimentos</p>

          <div className={styled.tabelaAlimentos}>
            <ConfigProvider locale={ptBR}>
              <ProTable
                rowKey="id"
                size="small"
                options={false}
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
            <Modal
              keyboard={false}
              destroyOnHidden
              width={800}
              title="Alimento da refeição"
              open={open}
              onOk={handleOk}
              okText="Salvar"
              cancelText="Cancelar"
              onCancel={handleCancel}
              footer={(_, { CancelBtn, OkBtn,  }) => (
                <>
                  <CancelBtn/>
                  <Button onClick={() => alimentoForm.handleSubmit((data) => {
                    setAlimentos((prev) => [...prev, { ...data, id: Date.now() }]);
                    alimentoForm.reset();
                  })()}>
                    Salvar e Continuar
                  </Button>
                  <OkBtn />
                </>
              )}
            >
              <form onSubmit={alimentoForm.handleSubmit(handleOk)}>
                <div className={styled.rowModal}>
                  <InputField
                    ref={inputAlimentoRef}
                    idInput="nomeAlimento"
                    idDiv={styled.nomeAlimentoCampo}
                    label="Alimento"
                    type="text"
                    maxLength={40}
                    obrigatorio={true}
                    register={alimentoForm.register}
                    error={alimentoForm.formState.errors.nomeAlimento}
                  />

                  <SelectField
                      id={styled.unidadeAlimentoCampo}
                      name="unidadeAlimento"
                      label="Unidade Alimento"
                      control={alimentoForm.control}
                      options={unidadeAlimentoOptions}
                      placeholder="Selecione uma opção"
                      required
                      error={alimentoForm.formState.errors.unidadeAlimento}
                  />

                  <InputField
                    idInput="quantidadeAlimento"
                    idDiv={styled.quantidadeAlimentoCampo}
                    label="Quantidade"
                    type="number"
                    obrigatorio={true}
                    valueAsNumber={true}
                    defaultValue={1}
                    min={1}
                    register={alimentoForm.register}
                    error={alimentoForm.formState.errors.quantidadeAlimento}
                  />
                </div>
              </form>
            </Modal>
            <button className={styled.btnAddAlimento} type="button" onClick={showModal}>
              Adicionar Alimento
            </button>
          </div>
        </section>
        <FooterForm title={ id ? "Editar" : "Cadastrar"} updateDateField={dataAlteracaoField}/>
      </form>
    </section>
  );
};

export default RefeicaoForm;