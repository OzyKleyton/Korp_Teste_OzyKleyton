package repository

import (
	"errors"

	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model/nota"
	"gorm.io/gorm"
)

type NotaFiscalRepository interface {
	Create(nota *nota.NotaFiscal) (*nota.NotaFiscal, error)
	FindAll(page, limit int) ([]nota.NotaFiscal, int64, error)
	FindByID(id uint) (*nota.NotaFiscal, error)
	Update(nota *nota.NotaFiscal) (*nota.NotaFiscal, error)
	GetLastNumeroSequencial() (int64, error)
}

type NotaFiscalRepo struct {
	db *gorm.DB
}

func NewNotaFiscalRepository(db *gorm.DB) NotaFiscalRepository {
	return &NotaFiscalRepo{
		db: db,
	}
}

func (r *NotaFiscalRepo) Create(nota *nota.NotaFiscal) (*nota.NotaFiscal, error) {
	if err := r.db.Create(nota).Error; err != nil {
		return nil, err
	}

	return nota, nil
}

func (r *NotaFiscalRepo) FindAll(page, limit int) ([]nota.NotaFiscal, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	notas := []nota.NotaFiscal{}
	query := r.db.Model(&nota.NotaFiscal{}).Preload("Itens")

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Limit(limit).Offset(offset).Find(&notas).Error; err != nil {
		return nil, 0, err
	}

	return notas, total, nil
}

func (r *NotaFiscalRepo) FindByID(id uint) (*nota.NotaFiscal, error) {
	notaFiscal := &nota.NotaFiscal{}
	if err := r.db.Preload("Itens").First(notaFiscal, id).Error; err != nil {
		return nil, err
	}

	return notaFiscal, nil
}

func (r *NotaFiscalRepo) Update(nota *nota.NotaFiscal) (*nota.NotaFiscal, error) {
	if err := r.db.Save(nota).Error; err != nil {
		return nil, err
	}

	return nota, nil
}

func (r *NotaFiscalRepo) GetLastNumeroSequencial() (int64, error) {
	var ultimaNota nota.NotaFiscal
	if err := r.db.Order("numero_sequencial desc").First(&ultimaNota).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}
		return 0, err
	}

	return ultimaNota.NumeroSequencial, nil
}
