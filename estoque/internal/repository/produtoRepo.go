package repository

import (
	"fmt"

	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProdutoRepository interface {
	Create(produto *produto.Produto) (*produto.Produto, error)
	FindAll() ([]produto.Produto, error)
	FindByID(id uint) (produto *produto.Produto, err error)
	Update(produto *produto.Produto) (*produto.Produto, error)
	Delete(id uint) (produto *produto.Produto, err error)
	ProcessSaida(itens []produto.ProdutoSaidaItem) ([]produto.Produto, error)
}

type ProdutoRepo struct {
	db *gorm.DB
}

func NewProdutoRepository(db *gorm.DB) ProdutoRepository {
	return &ProdutoRepo{
		db: db,
	}
}

func (p *ProdutoRepo) Create(produto *produto.Produto) (*produto.Produto, error) {
	if err := p.db.Create(produto).Error; err != nil {
		return nil, err
	}

	return produto, nil
}

func (p *ProdutoRepo) FindAll() (produtos []produto.Produto, err error) {
	if err := p.db.Find(&produtos).Error; err != nil {
		return nil, err
	}

	return produtos, nil
}

func (p *ProdutoRepo) FindByID(id uint) (produto *produto.Produto, err error) {
	if err := p.db.First(&produto, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return produto, nil
}

func (p *ProdutoRepo) Update(produto *produto.Produto) (*produto.Produto, error) {
	if err := p.db.Save(&produto).Error; err != nil {
		return nil, err
	}

	return produto, nil
}

func (p *ProdutoRepo) Delete(id uint) (produto *produto.Produto, err error) {
	if err := p.db.Where("id = ?", id).Delete(&produto).Error; err != nil {
		return nil, err
	}

	return produto, nil
}

func (p *ProdutoRepo) ProcessSaida(itens []produto.ProdutoSaidaItem) ([]produto.Produto, error) {
	tx := p.db.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	produtos := []produto.Produto{}
	for _, item := range itens {
		var prod produto.Produto
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&prod, "id = ?", item.ProdutoID).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		if prod.Saldo < item.Quantidade {
			tx.Rollback()
			return nil, fmt.Errorf("produto %d saldo insuficiente", item.ProdutoID)
		}

		prod.Saldo -= item.Quantidade
		if err := tx.Save(&prod).Error; err != nil {
			tx.Rollback()
			return nil, err
		}

		produtos = append(produtos, prod)
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return produtos, nil
}
