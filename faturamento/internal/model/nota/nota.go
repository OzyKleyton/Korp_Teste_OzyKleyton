package nota

import "gorm.io/gorm"

type NotaFiscal struct {
	gorm.Model
	NumeroSequencial int64      `json:"numero_sequencial"`
	Status           string     `json:"status"`
	Itens            []ItemNota `json:"itens" gorm:"foreignKey:NotaFiscalID;constraint:OnDelete:CASCADE"`
}

type ItemNota struct {
	gorm.Model
	NotaFiscalID uint  `json:"-"`
	ProdutoID    uint  `json:"produto_id"`
	Quantidade   int64 `json:"quantidade"`
}
