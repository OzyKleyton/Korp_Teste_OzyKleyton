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

Depois, abra no navegador:

```bash
http://localhost:4200
```

## Endpoints principais

### Estoque

- `POST /api/v1/produtos/` - cadastra produto com saldo
- `GET /api/v1/produtos/` - lista produtos
- `PUT /api/v1/produtos/:id` - atualiza produto e saldo
- `DELETE /api/v1/produtos/:id` - remove produto
- `POST /api/v1/produtos/saida` - processa saída de estoque por itens

### Faturamento

- `POST /api/v1/notas/` - cria nota fiscal Aberta
- `GET /api/v1/notas/` - lista notas fiscais
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
- Tratamento de erro no backend e feedback visual via toast no frontend quando o serviço de estoque falhar ou não houver saldo suficiente.
- Concurrency control no estoque: saída de produtos em transação com bloqueio `SELECT FOR UPDATE`.

> Observação: não há um documento de requisitos formal dentro do repositório, então esta verificação foi feita com base nas funcionalidades implementadas e nas APIs existentes.

## Roteiro técnico para o vídeo

1. Apresentação rápida do projeto:
   - `estoque`: API Go para gerenciamento de produtos e saldo.
   - `faturamento`: API Go para emissão de notas fiscais.
   - `frontend`: aplicação Angular que consome as duas APIs.
2. Explique a arquitetura:
   - Microsserviços independentes.
   - Banco PostgreSQL para persistência.
   - Comunicação HTTP entre `faturamento` e `estoque`.
3. Mostre o front:
   - Cadastro de produto e visualização de estoque.
   - Criação de nota fiscal com itens.
   - Impressão da nota e débito automático do estoque.
4. Detalhe técnico:
   - Frontend com Angular 21, standalone components e `provideRouter`.
   - Uso de RxJS no frontend para chamadas HTTP e `firstValueFrom` no carregamento de configuração.
   - Gerenciamento de estado com `signal` e stores reativos para `produtos` e `notas`.
   - O projeto não usa `OnInit` explicitamente; o carregamento inicial de dados é feito via serviços e signals.
   - Backend em Go com Fiber, GORM e Viper.
   - Docker Compose para levantar frontend, APIs e bancos.
   - `.env.example` como guia para configuração local.
5. Demonstração final:
   - Rodar `bash run.sh` no root.
   - Acessar `http://localhost:4200`.
   - Mostrar funcionamento completo da jornada de estoque + faturamento.

## Detalhe técnico a mencionar

- O frontend foi organizado como uma aplicação moderna Angular, com rotas e componentes standalone para melhor manutenção.
- A camada de serviços frontend centraliza chamadas HTTP e estado reativo para sincronizar produtos e notas.
- A emissão de nota não apenas cria o documento, mas também atualiza o estoque via integração entre serviços.
- O `.env.example` fornece o template de configuração sem expor dados sensíveis.
