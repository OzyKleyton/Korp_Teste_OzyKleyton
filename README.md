# Korp_Teste_OzyKleyton

Neste repositório há três aplicações:

- `estoque` (API Go)
- `faturamento` (API Go)
- `frontend` (Angular)

## Como executar

No diretório raiz do repositório execute:

```bash
bash run.sh
```

> Para desenvolvimento local, garanta que `ENVIRONMENT=DEVELOPMENT` esteja definido em `.env` na raiz do projeto. Isso ativa o seed de produtos de exemplo, limpa o estoque e também limpa as notas fiscais ao subir a aplicação.

Depois, abra no navegador:

```bash
http://localhost:4200
```

## Endpoints principais

### Estoque

- `POST /api/v1/produtos/` - cadastra produto com saldo
- `GET /api/v1/produtos/?page=1&limit=10` - lista produtos com paginação
- `PUT /api/v1/produtos/:id` - atualiza produto e saldo
- `DELETE /api/v1/produtos/:id` - remove produto
- `POST /api/v1/produtos/saida` - processa saída de estoque por itens

### Faturamento

- `POST /api/v1/notas/` - cria nota fiscal Aberta
- `GET /api/v1/notas/?page=1&limit=10` - lista notas fiscais com paginação
- `GET /api/v1/notas/:id` - consulta nota fiscal
- `POST /api/v1/notas/:id/imprimir` - imprime nota fiscal e fecha a nota

## Fluxo de integração

Quando a nota fiscal é impressa no serviço `faturamento`, o backend chama o serviço `estoque` em `POST /api/v1/produtos/saida` para debitar os saldos dos produtos usados na nota.

Se o estoque não puder ser atualizado (saldo insuficiente ou erro de conexão), a nota não é fechada e o erro é retornado.

## Atualizações recentes

- O frontend foi reorganizado para usar componentes standalone em `frontend/src/app/components/`.
- Os serviços de frontend agora ficam sob `frontend/src/app/services/`.
- A arquitetura de notas e produtos foi dividida em componentes menores para melhorar reutilização e reatividade.
- Validação do build confirmada com `npm run build`.

## Cobertura de requisitos do teste

A partir da estrutura do repositório e das entregas implementadas, o projeto atende aos principais pontos esperados:

- Microsserviços separados para `estoque` e `faturamento` em Go.
- API REST para cadastro, consulta e atualização de produtos.
- API REST para criação e emissão de notas fiscais.
- Integração entre `faturamento` e `estoque` para debitar saldo ao imprimir a nota.
- Frontend Angular com navegação entre páginas de produtos e notas.
- Componentização e serviços frontend organizados em `components/` e `services/`.
- Uso de `Docker Compose` para orquestrar os serviços e bancos de dados.
- Controlador de configuração com `.env.example` para facilitar o clone do repositório.
- Indicador de processamento na impressão de nota fiscal.
- Paginação de produtos e notas no frontend com suporte a `page` e `limit` no backend.
- Tratamento de erro no backend e feedback visual via toast no frontend quando o serviço de estoque falhar ou não houver saldo suficiente.
- Concurrency control no estoque: saída de produtos em transação com bloqueio `SELECT FOR UPDATE`.

## Detalhamento técnico

- Frontend em Angular 21 com componentes standalone e `provideRouter`.
- Uso de `signal` e uma camada de stores reativas para gerenciamento de estado de produtos e notas.
- API do frontend centraliza chamadas HTTP em `frontend/src/app/services/`.
- Backend em Go usando Fiber, GORM e Viper para configuração e persistência.
- Integridade transacional no estoque via `POST /api/v1/produtos/saida` durante a impressão de nota.
- Docker Compose orquestra frontend, APIs e bancos de dados PostgreSQL.
- `.env.example` fornece um template de configuração local sem expor segredos.

> Observação: não há um documento de requisitos formal dentro do repositório, então esta verificação foi feita com base nas funcionalidades implementadas e nas APIs existentes.
