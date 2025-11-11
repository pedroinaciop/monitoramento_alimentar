# 🥗 Sistema de Monitoramento Alimentar

## 📖 Descrição Geral
O **Sistema de Monitoramento Alimentar** é uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) com o objetivo de auxiliar usuários no acompanhamento de seus hábitos alimentares e medidas corporais, promovendo maior controle sobre a saúde e o bem-estar físico.

A plataforma permite o **registro de medidas corporais**, o **cálculo automático do IMC (Índice de Massa Corporal)** e o **monitoramento da evolução física ao longo do tempo**, além de oferecer um **painel interativo** para visualização de dados e relatórios personalizados.

---

## 🎯 Objetivos

### 🧩 Objetivo Geral
Desenvolver um sistema web que possibilite o monitoramento de informações relacionadas à alimentação e composição corporal, contribuindo para o acompanhamento da saúde e incentivo a hábitos alimentares saudáveis.

### 🎯 Objetivos Específicos
- Implementar uma API REST utilizando o framework **Spring Boot** para gerenciar dados e regras de negócio;  
- Criar uma interface interativa com **React**, priorizando a experiência do usuário;  
- Armazenar as informações em um banco de dados **MySQL**;  
- Permitir o cálculo automático do **IMC** e a classificação conforme os parâmetros da **Organização Mundial da Saúde (OMS)**;  
- Disponibilizar gráficos e relatórios de progresso do usuário;  
- Oferecer notificações e mensagens de feedback conforme os resultados obtidos.

---

## 🧱 Arquitetura do Sistema

O sistema foi desenvolvido seguindo a arquitetura **cliente-servidor**, dividida em dois módulos principais:

### 🖥️ Back-End
- **Framework:** Spring Boot  
- **Linguagem:** Java  
- **Banco de Dados:** MySQL  
- **ORM:** JPA (Java Persistence API)  
- **Gerenciador de dependências:** Maven  

**Principais responsabilidades:**
- Criação e gerenciamento das entidades `Usuário`, `Medidas`, `Refeição` e `Alimento`;
- Implementação dos endpoints REST para operações CRUD;
- Cálculo e classificação do IMC;
- Integração com o front-end via API HTTP.

### 🌐 Front-End
- **Framework:** React  
- **Linguagem:** JavaScript  
- **Bibliotecas:** Material UI / Ant Design / Axios  

**Principais funcionalidades:**
- Formulários de cadastro e login;  
- Painel de controle com visualização de medidas e IMC;  
- Gráficos interativos e alertas de progresso;  
- Comunicação com a API via requisições HTTP.

---

## ⚙️ Funcionalidades Principais
✅ Cadastro e autenticação de usuários  
✅ Registro de medidas corporais (altura, peso, tórax, cintura, quadril, etc.)  
✅ Cálculo automático do IMC e exibição da classificação  
✅ Visualização de relatórios e gráficos de evolução  
✅ Registro e acompanhamento de refeições diárias  
✅ Notificações e mensagens de orientação conforme o resultado do IMC  

---

## 📊 Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
|--------|-------------|-----------|
| Back-End | **Java / Spring Boot** | Criação da API REST e regras de negócio |
| Banco de Dados | **MySQL** | Armazenamento de dados dos usuários e medidas |
| Front-End | **React** | Interface interativa e responsiva |
| ORM | **JPA / Hibernate** | Mapeamento objeto-relacional |
| Build | **Maven** | Gerenciamento de dependências |
| Estilo | **Material UI / Ant Design** | Design moderno e responsivo |
| Hospedagem | **Hostinger / AWS (planejado)** | Implantação da aplicação e banco de dados |

---

## 🧠 Metodologia de Desenvolvimento
O projeto foi desenvolvido utilizando a **metodologia incremental**, permitindo a construção gradual das funcionalidades e testes contínuos de integração entre as camadas.  

**Etapas principais:**
1. Levantamento de requisitos e modelagem do banco de dados;  
2. Desenvolvimento da API e entidades JPA;  
3. Criação da interface e componentes React;  
4. Integração entre front-end e back-end;  
5. Testes unitários e de integração;  
6. Implantação e documentação final.

---

## 🚀 Instalação e Execução

### 🔧 Pré-requisitos
- Java 24  
- Node.js 25 
- MySQL  

### 🖥️ Back-End
```bash
# Clonar o repositório
git clone https://github.com/usuario/monitoramento-alimentar.git

# Entrar na pasta do backend
cd backend

# Executar a aplicação
mvn spring-boot:run
```

### 🖥️ Back-End
```bash

# Entrar na pasta do front-end
cd frontend

# Instalar dependências
npm install

# Executar o projeto
npm start
```

--

##🖼️ Prints do Sistema

	Tela de autenticação de usuários

	Painel principal com IMC e medidas corporais

	Registro e listagem das refeições do usuário

	Gráfico de evolução do IMC e peso ao longo do tempo

--

##📈 Resultados Esperados

Com a implantação do sistema, espera-se que o usuário consiga acompanhar de forma prática e visual a evolução de suas medidas corporais e hábitos alimentares, utilizando os indicadores apresentados como apoio para uma rotina mais saudável e equilibrada.

##📚 Referências Bibliográficas

WALLS, Craig. Spring Boot in Action. Manning Publications, 2016.
React Documentation. Disponível em: https://react.dev
Organização Mundial da Saúde (OMS). Índice de Massa Corporal (IMC). Disponível em: https://www.who.int
ALURA Cursos Online. Formação Java e Spring Boot / React com TypeScript.
DEITEL, Paul; DEITEL, Harvey. Java: Como Programar. Pearson, 2017.
