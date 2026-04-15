package produto

type ProdutoReq struct {
	Codigo    string `json:"codigo"`
	Descricao string `json:"descricao"`
	Saldo     int64  `json:"saldo"`
}

type ProdutoRes struct {
	ID        uint   `json:"id"`
	Codigo    string `json:"codigo"`
	Descricao string `json:"descricao"`
	Saldo     int64  `json:"saldo"`
}

type ProdutoSaidaItem struct {
	ProdutoID  uint  `json:"produto_id"`
	Quantidade int64 `json:"quantidade"`
}

func (u *ProdutoReq) ToProduto() *Produto {
	return &Produto{
		Codigo:    u.Codigo,
		Descricao: u.Descricao,
		Saldo:     u.Saldo,
	}
}

func (ur *Produto) ToProdutoRes() *ProdutoRes {
	return &ProdutoRes{
		ID:        ur.ID,
		Codigo:    ur.Codigo,
		Descricao: ur.Descricao,
		Saldo:     ur.Saldo,
	}
}
