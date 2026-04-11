package repository

import (
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"gorm.io/gorm"
)

type ProdutoRepository interface {
	Create(produto *produto.Produto) (*produto.Produto, error)
	FindAll() ([]produto.Produto, error)
	FindByID(id uint) (produto *produto.Produto, err error)
	Update(produto *produto.Produto) (*produto.Produto, error)
	Delete(id uint) (produto *produto.Produto, err error)
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
