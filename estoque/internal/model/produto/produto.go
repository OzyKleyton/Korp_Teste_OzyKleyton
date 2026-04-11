package produto

import "gorm.io/gorm"

type Produto struct {
	gorm.Model
	Codigo    string
	Descricao string
	Saldo     int64
}
