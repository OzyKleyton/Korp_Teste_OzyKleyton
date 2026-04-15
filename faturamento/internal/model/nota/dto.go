package nota

import "time"

type ItemNotaReq struct {
	ProdutoID  uint  `json:"produto_id"`
	Quantidade int64 `json:"quantidade"`
}

type ItemNotaRes struct {
	ID         uint  `json:"id"`
	ProdutoID  uint  `json:"produto_id"`
	Quantidade int64 `json:"quantidade"`
}

type NotaFiscalReq struct {
	NumeroSequencial int64         `json:"numero_sequencial,omitempty"`
	Status           string        `json:"status,omitempty"`
	Itens            []ItemNotaReq `json:"itens,omitempty"`
}

type NotaFiscalRes struct {
	ID               uint          `json:"id"`
	NumeroSequencial int64         `json:"numero_sequencial"`
	Status           string        `json:"status"`
	Itens            []ItemNotaRes `json:"itens,omitempty"`
	CreatedAt        time.Time     `json:"created_at"`
}

func (nr *NotaFiscalReq) ToNotaFiscal() *NotaFiscal {
	itens := make([]ItemNota, 0, len(nr.Itens))
	for _, item := range nr.Itens {
		itens = append(itens, ItemNota{
			ProdutoID:  item.ProdutoID,
			Quantidade: item.Quantidade,
		})
	}

	return &NotaFiscal{
		NumeroSequencial: nr.NumeroSequencial,
		Status:           nr.Status,
		Itens:            itens,
	}
}

func (n *NotaFiscal) ToNotaFiscalRes() *NotaFiscalRes {
	itens := make([]ItemNotaRes, 0, len(n.Itens))
	for _, item := range n.Itens {
		itens = append(itens, ItemNotaRes{
			ID:         item.ID,
			ProdutoID:  item.ProdutoID,
			Quantidade: item.Quantidade,
		})
	}

	return &NotaFiscalRes{
		ID:               n.ID,
		NumeroSequencial: n.NumeroSequencial,
		Status:           n.Status,
		Itens:            itens,
		CreatedAt:        n.CreatedAt,
	}
}
