
import styled from './HomePage.module.css';
import api from '../../services/api';
import infoIcon from '../../assets/images/info.png';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { enqueueSnackbar } from 'notistack';

const HomePage = () => {
    const [open, setOpen] = useState(false);
    const [imcValue, setImcValue] = useState(0);
    const usuario_id = sessionStorage.getItem("usuario_id");
    const markerPosition = Math.min((imcValue / 60) * 100, 100);

    const showModal = () => {
        setOpen(true);
    }

    useEffect(() => {
        api.get(`/medidas/imc/${usuario_id}`)
            .then(response => {
                setImcValue(response.data);

                if (response.data <= 0) {
                     enqueueSnackbar("Medidas não cadastradas. Por favor, registre sua medidas para que o calculo do IMC seja realizado.", { variant: "info", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
            });
    }, [usuario_id]);

    return (
        <section className={styled.mainContent}>
              <header className={styled.header}>    
                <h1>Bem-vindo ao Monitoramento Alimentar</h1>
                <p>Utilize o menu para navegar entre as diferentes seções.</p>   
              </header>
              <section className={styled.card}>   
                    <div className={styled.imcContainer}>
                        <Modal
                            title="Índice de Massa Corporal (IMC)"
                            destroyOnHidden
                            width={800}
                            open={open}
                            onCancel={() => setOpen(false)}
                            footer={null}
                        >
                            <p>O IMC é uma medida utilizada para avaliar se uma pessoa está dentro do peso ideal em relação à sua altura. Ele é calculado dividindo o peso pela altura ao quadrado.<br/> No Monitoramento Alimentar, o IMC é calculado com base no último registro de medidas.</p>
                            <ul className={styled.listaCategoriasIMC}>
                                { imcValue > 0 && imcValue < 18.50 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.primeiroItemCategoria}></div>
                                        <p className={styled.tipoCategoria}> Abaixo do peso</p>
                                        <p className={styled.valoresCategoria}>Abaixo de 18.5</p>
                                    </li>
                                ) : (
                                    <li className={styled.itemCategoria}> 
                                        <div className={styled.primeiroItemCategoria}></div>
                                        <p className={styled.tipoCategoria}> Abaixo do peso</p>
                                        <p className={styled.valoresCategoria}>Abaixo de 18.5</p>
                                    </li>
                                )}
                               
                                { imcValue > 18.50 && imcValue <= 24.90 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.segundoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Normal</p>
                                        <p className={styled.valoresCategoria}>18.5 - 24.9</p>
                                    </li>
                                ) : (
                                    <li className={styled.itemCategoria}>
                                        <div className={styled.segundoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Normal</p>
                                        <p className={styled.valoresCategoria}>18.5 - 24.9</p>
                                    </li>
                                )}

                                { imcValue > 24.90 && imcValue <= 29.90 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.terceiroItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Sobrepeso</p>
                                        <p className={styled.valoresCategoria}>25.0 - 29.9</p>
                                    </li>
                                ) : (
                                    <li className={styled.itemCategoria}>
                                        <div className={styled.terceiroItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Sobrepeso</p>
                                        <p className={styled.valoresCategoria}>25.0 - 29.9</p>
                                    </li>
                                )}

                                { imcValue > 29.90 && imcValue <= 34.90 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.quartoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau I</p>
                                        <p className={styled.valoresCategoria}>30.0 - 34.9</p>
                                    </li>
                                ) : (
                                    <li className={styled.itemCategoria}>
                                        <div className={styled.quartoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau I</p>
                                        <p className={styled.valoresCategoria}>30.0 - 34.9</p>
                                    </li>
                                )}

                                { imcValue > 34.90 && imcValue <= 39.90 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.quintoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau II</p>
                                        <p className={styled.valoresCategoria}>35.0 - 39.9</p>
                                    </li>
                                ) : (
                                    <li className={styled.itemCategoria}>
                                        <div className={styled.quintoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau II</p>
                                        <p className={styled.valoresCategoria}>35.0 - 39.9</p>
                                    </li>
                                )}

                                 { imcValue > 39.90 ? (
                                    <li className={`${styled.itemCategoria} ${styled.itemCategoriaSelected}`}>
                                        <div className={styled.sextoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau III</p>
                                        <p className={styled.valoresCategoria}>Acima de 40.0</p>
                                    </li>
                                 ) : (
                                    <li className={styled.itemCategoria}>
                                        <div className={styled.sextoItemCategoria}></div>
                                        <p className={styled.tipoCategoria}>Obesidade grau III</p>
                                        <p className={styled.valoresCategoria}>Acima de 40.0</p>
                                    </li>
                                 )}
                            </ul>
                        </Modal>
                        <div className={styled.imcHeader}>
                            <img src={infoIcon} alt="Ícone de informação sobre IMC" className={styled.infoIcon} onClick={showModal}/>              
                            <div className={styled.imcTitulo}>Seu IMC é:</div>
                        </div>
                        {imcValue === 0 ? (
                            <div className={styled.imcValor}>--</div>
                        ) : (
                            <div className={styled.imcValor}>{imcValue}</div>
                        )}
                        <div className={styled.imcBarContainer}>
                            <div className={styled.imcBar}></div>
                            <div className={styled.imcMarker} style={{ left: `${markerPosition}%` }}></div>
                        </div>
                    </div>
              </section>
        </section>
    );
}

export default HomePage;