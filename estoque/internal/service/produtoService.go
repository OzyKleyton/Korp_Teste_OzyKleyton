package service

import (
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/repository"
)

type ProdutoService interface {
	CreateProduto(produtoReq *produto.ProdutoReq) *model.Response
	FindAllProdutos(page, limit int) *model.Response
	UpdateProduto(id uint, produtoReq *produto.ProdutoReq) *model.Response
	DeleteProduto(id uint) *model.Response
	ProcessSaida(itens []produto.ProdutoSaidaItem) *model.Response
}

type ProdutoServiceImpl struct {
	repo repository.ProdutoRepository
}

func NewProdutoService(repo repository.ProdutoRepository) ProdutoService {
	return &ProdutoServiceImpl{
		repo: repo,
	}
}

func (ps *ProdutoServiceImpl) CreateProduto(produtoReq *produto.ProdutoReq) *model.Response {
	produto := produtoReq.ToProduto()

	createProduto, err := ps.repo.Create(produto)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	return model.NewSuccessResponse(createProduto.ToProdutoRes())
}

func (ps *ProdutoServiceImpl) FindAllProdutos(page, limit int) *model.Response {
	produtos, total, err := ps.repo.FindAll(page, limit)
	if err != nil {
		return model.NewErrorResponse(err, 404)
	}

	produtosResponse := make([]*produto.ProdutoRes, 0, len(produtos))
	for _, u := range produtos {
		produtosResponse = append(produtosResponse, u.ToProdutoRes())
	}

	return model.NewSuccessResponse(model.NewPaginationData(produtosResponse, total))
}

func (ps *ProdutoServiceImpl) UpdateProduto(id uint, produtoReq *produto.ProdutoReq) *model.Response {
	produto, err := ps.repo.FindByID(id)
	if err != nil {
		return model.NewErrorResponse(err, 404)
	}

	produto.Codigo = produtoReq.Codigo
	produto.Descricao = produtoReq.Descricao
	produto.Saldo = produtoReq.Saldo

	updateProduto, err := ps.repo.Update(produto)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	return model.NewSuccessResponse(updateProduto.ToProdutoRes())
}

func (ps *ProdutoServiceImpl) DeleteProduto(id uint) *model.Response {
	produtoID, err := ps.repo.FindByID(id)
	if err != nil {
		return model.NewErrorResponse(err, 404)
	}
	_, err = ps.repo.Delete(produtoID.ID)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	return model.NewSuccessResponse(nil)
}

func (ps *ProdutoServiceImpl) ProcessSaida(itens []produto.ProdutoSaidaItem) *model.Response {
	produtos, err := ps.repo.ProcessSaida(itens)
	if err != nil {
		return model.NewErrorResponse(err, 400)
	}

	produtosResponse := []*produto.ProdutoRes{}
	for _, p := range produtos {
		produtosResponse = append(produtosResponse, p.ToProdutoRes())
	}

	return model.NewSuccessResponse(produtosResponse)
}
