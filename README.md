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
