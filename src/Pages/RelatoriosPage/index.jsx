import { zodResolver } from "@hookform/resolvers/zod";
import { FileOutlined } from '@ant-design/icons'
import { formatDateToISODate, formatDateToBrazilian } from "../../utils/formatDate";
import InputField from "../../Components/InputField";
import styled from "./RelatoriosPage.module.css";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { Button, Collapse, Modal } from 'antd';
import api from "../../services/api";
import { useState } from "react";
import { z } from "zod";

const RelatorioPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const usuario_id = sessionStorage.getItem("usuario_id");
  const nomeUsuario = sessionStorage.getItem("user");
  const [expandIconPosition, setExpandIconPosition] = useState('start');
  const [openEmailMedidas, setOpenEmailMedidas] = useState(false);
  const [openEmailRefeicoes, setOpenEmailRefeicoes] = useState(false);

  const createMedidasFormSchema = z.object({
    dataInicial: z.coerce.date().default(new Date()),
    dataFinal: z.coerce.date().default(new Date()),
  });

  const enviarEmailSchema = z.object({
    to: z.string().email().min(1, "Campo obrigatório"),
    dataInicial: z.coerce.date().default(new Date()),
    dataFinal: z.coerce.date().default(new Date()),
  });

  const enviarEmailForm = useForm({
    resolver: zodResolver(enviarEmailSchema)
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createMedidasFormSchema),
  });


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const createMedidaReport = (data) => { 
    api.post("relatorios/medidas/download",{
          usuarioId: usuario_id,
          dataInicial: formatDateToISODate(data.dataInicial, 1),
          dataFinal: formatDateToISODate(data.dataFinal, 1)
        },
        {
          headers: {"Content-Type": "application/json"},
          responseType: "blob"
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "relatorio-medidas.pdf";
        a.click();
        window.URL.revokeObjectURL(url);

        enqueueSnackbar("Relatório gerado com sucesso!", {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      })
  };

  const createRefeicoesReport = (data) => { 
    api.post("relatorios/refeicoes/download",{
          usuarioId: usuario_id,
          dataInicial: formatDateToISODate(data.dataInicial, 1),
          dataFinal: formatDateToISODate(data.dataFinal, 1)
        },
        {
          headers: {"Content-Type": "application/json"},
          responseType: "blob"
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "relatorio-refeicoes.pdf";
        a.click();
        window.URL.revokeObjectURL(url);

        enqueueSnackbar("Relatório gerado com sucesso!", {
          variant: "success",
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      })
  };

  const enviarEmailMedidas = (data) => { 
    api.post(`email/medidas`,{
          to: data.to, 
          subject: `Relatório de Medidas - ${formatDateToBrazilian(data.dataInicial, 1)} a ${formatDateToBrazilian(data.dataFinal, 1)}`,
          body: `Segue em anexo o relatório de medidas solicitado do paciente ${nomeUsuario} no período de ${formatDateToBrazilian(data.dataInicial, 1)} a ${formatDateToBrazilian(data.dataFinal, 1)}.`,
          dataInicial: formatDateToISODate(data.dataInicial, 1),
          dataFinal: formatDateToISODate(data.dataFinal, 1),
          usuarioId: usuario_id,
        },
        {
          headers: {"Content-Type": "application/json"},
          responseType: "blob"
        }
      )
      .then(() => {
        enqueueSnackbar("Relatório enviado por e-mail com sucesso!", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      })
  };

  const enviarEmailRefeicoes = (data) => { 
    api.post(`email/refeicoes`,{
          to: data.to, 
          subject: `Relatório de Refeições - ${formatDateToBrazilian(data.dataInicial, 1)} a ${formatDateToBrazilian(data.dataFinal, 1)}`,
          body: `Segue em anexo o relatório de refeições solicitado do paciente ${nomeUsuario} no período de ${formatDateToBrazilian(data.dataInicial, 1)} a ${formatDateToBrazilian(data.dataFinal, 1)}.`,
          dataInicial: formatDateToISODate(data.dataInicial, 1),
          dataFinal: formatDateToISODate(data.dataFinal, 1),
          usuarioId: usuario_id,
        },
        {
          headers: {"Content-Type": "application/json"},
          responseType: "blob"
        }
      )
      .then(() => {
        enqueueSnackbar("Relatório enviado por e-mail com sucesso!", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      })
  };

  const handleMedidasOk = enviarEmailForm.handleSubmit((data) => {
    enviarEmailMedidas(data);
    setOpenEmailMedidas(false);
  });

  const handleRefeicoesOk = enviarEmailForm.handleSubmit((data) => {
    enviarEmailRefeicoes(data);
    setOpenEmailRefeicoes(false);
  });

  const genExtra = () => (
    <FileOutlined
      onClick={(event) => {
        event.stopPropagation();
      }}
    />
  );

  const handleMedidasCancel = () => {
    setOpenEmailMedidas(false);
  }

  const handleRefeicoesCancel = () => {
    setOpenEmailRefeicoes(false);
  }

  const showMedidasModal = () => {
    setOpenEmailMedidas(true);
  };

  const showRefeicoesModal = () => {
    setOpenEmailRefeicoes(true);
  };

  const items = [
    {
      key: '1',
      label: 'Medidas por período',
      children: 
      <form onSubmit={handleSubmit(createMedidaReport)} onKeyDown={handleKeyDown} autoComplete="off">
        <main className={styled.contextForm}>
          <section className={styled.campos}>
            <div className={styled.row}>
              <InputField
                idInput="dataInicial"
                autoFocus
                idDiv={styled.dataInicialCampo}
                label="Período Inicial"
                obrigatorio={true}
                type="date"
                register={register}
                defaultValue={formatDateToISODate(new Date(), 0, 30)}
                error={errors.dataInicial}
              />

              <InputField
                idInput="dataFinal"
                autoFocus
                idDiv={styled.dataFinalCampo}
                label="Período Final"
                obrigatorio={true}
                type="date"
                register={register}
                defaultValue={formatDateToISODate(new Date(), 1, 0)}
                error={errors.dataFinal}
              />
            </div>
              <Modal
                open={openEmailMedidas}
                onOk={handleMedidasOk}
                onCancel={handleMedidasCancel}
                keyboard={false}
                destroyOnHidden
                width={800}
                title="Enviar relatório por e-mail"
                cancelText="Cancelar"
                footer={(_, { CancelBtn }) => (
                  <>
                    <CancelBtn/>
                    <Button type="primary" onClick={handleMedidasOk} >
                      Enviar
                    </Button>
                  </>
                )}
              >
                <form onSubmit={handleMedidasOk} onKeyDown={handleKeyDown} autoComplete="off">
                  <div>
                    <InputField
                      idInput="to"
                      autoFocus
                      idDiv={styled.toCampo}
                      label="Destinatário do E-mail"
                      obrigatorio={true}
                      maxLength={100}
                      type="email"
                      register={enviarEmailForm.register}
                      error={enviarEmailForm.formState.errors.to}
                    />
                  </div>
                  <div className={styled.rowModal}>
                    <InputField
                      idInput="dataInicial"
                      idDiv={styled.dataInicialCampo}
                      label="Período Inicial"
                      obrigatorio={true}
                      type="date"
                      defaultValue={formatDateToISODate(new Date(), 0, 30)}
                      register={enviarEmailForm.register}
                      error={enviarEmailForm.formState.errors.dataInicial}
                    />

                    <InputField
                      idInput="dataFinal"
                      idDiv={styled.dataFinalCampo}
                      label="Período Final"
                      obrigatorio={true}
                      type="date"
                      defaultValue={formatDateToISODate(new Date(), 1, 0)}
                      register={enviarEmailForm.register}
                      error={enviarEmailForm.formState.errors.dataFinal}
                    />
                  </div>
                </form>
              </Modal>
            <div className={styled.btnGroup}>
              <button type="button" className={styled.btnRegister} onClick={showMedidasModal}>Enviar relatório por e-mail</button>
              <button type="submit" className={styled.btnRegister}>Gerar relatório</button>
            </div>
          </section>
        </main>
      </form>,
      extra: genExtra(),
    },
    {
      key: '2',
      label: 'Refeições por período',
      children: 
      <form onSubmit={handleSubmit(createRefeicoesReport)} onKeyDown={handleKeyDown} autoComplete="off">
        <main className={styled.contextForm}>
          <section className={styled.campos}>
             <Modal
                open={openEmailRefeicoes}
                onOk={handleRefeicoesOk}
                onCancel={handleRefeicoesCancel}
                keyboard={false}
                destroyOnHidden
                width={800}
                title="Enviar relatório por e-mail"
                cancelText="Cancelar"
                footer={(_, { CancelBtn }) => (
                  <>
                    <CancelBtn/>
                    <Button type="primary" onClick={handleRefeicoesOk} >
                      Enviar
                    </Button>
                  </>
                )}
              >
              <form onSubmit={handleMedidasOk} onKeyDown={handleKeyDown} autoComplete="off">
                <div>
                  <InputField
                    idInput="to"
                    autoFocus
                    idDiv={styled.toCampo}
                    label="Destinatário do E-mail"
                    obrigatorio={true}
                    maxLength={100}
                    type="email"
                    register={enviarEmailForm.register}
                    error={enviarEmailForm.formState.errors.to}
                  />
                </div>
                <div className={styled.rowModal}>
                  <InputField
                    idInput="dataInicial"
                    idDiv={styled.dataInicialCampo}
                    label="Período Inicial"
                    obrigatorio={true}
                    type="date"
                    defaultValue={formatDateToISODate(new Date(), 0, 30)}
                    register={enviarEmailForm.register}
                    error={enviarEmailForm.formState.errors.dataInicial}
                  />

                  <InputField
                    idInput="dataFinal"
                    idDiv={styled.dataFinalCampo}
                    label="Período Final"
                    obrigatorio={true}
                    type="date"
                    defaultValue={formatDateToISODate(new Date(), 1, 0)}
                    register={enviarEmailForm.register}
                    error={enviarEmailForm.formState.errors.dataFinal}
                  />
                </div>
              </form>
              </Modal>
            <div className={styled.row}>
              <InputField
                idInput="dataInicial"
                autoFocus
                idDiv={styled.dataInicialCampo}
                label="Período Inicial"
                obrigatorio={true}
                type="date"
                register={register}
                defaultValue={formatDateToISODate(new Date(), 0, 30)}
                error={errors.dataInicial}
              />

              <InputField
                idInput="dataFinal"
                autoFocus
                idDiv={styled.dataFinalCampo}
                label="Período Final"
                obrigatorio={true}
                type="date"
                register={register}
                defaultValue={formatDateToISODate(new Date())}
                error={errors.dataFinal}
              />
            </div>
            <div className={styled.btnGroup}>
              <button type="button" className={styled.btnRegister} onClick={showRefeicoesModal}>Enviar relatório por e-mail</button>
              <button type="submit" className={styled.btnRegister}>Gerar relatório</button>
            </div>
          </section>
        </main>
      </form>,
      extra: genExtra(),
    },
  ];

  return (
    <section className={styled.mainContent}>
        <header className={styled.header}>
          <h1>Relatórios</h1>
        </header>
        <Collapse
          expandIconPosition={expandIconPosition}
          items={items}
        />
    </section>
  );
};

export default RelatorioPage;