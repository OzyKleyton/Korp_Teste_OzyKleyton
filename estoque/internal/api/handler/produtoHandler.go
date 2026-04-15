package handler

import (
	"strconv"

	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/api/router"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/service"
	"github.com/gofiber/fiber/v2"
)

type ProdutoHandler struct {
	service service.ProdutoService
}

func NewProdutoHandler(service service.ProdutoService) *ProdutoHandler {
	return &ProdutoHandler{
		service: service,
	}
}

func (ph *ProdutoHandler) Routes() router.Router {
	return func(route fiber.Router) {
		user := route.Group("produtos")
		user.Post("/", ph.CreateProdutoHandler)
		user.Get("/", ph.FindAllProdutosHandler)
		user.Put("/:id", ph.UpdateProdutoHandler)
		user.Delete("/:id", ph.DeleteProdutoHandler)
		user.Post("/saida", ph.SaidaProdutosHandler)
	}
}

func (ph *ProdutoHandler) CreateProdutoHandler(c *fiber.Ctx) error {
	produtoReq := new(produto.ProdutoReq)
	if err := c.BodyParser(produtoReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewErrorResponse(err, fiber.ErrBadRequest))
	}

	res := ph.service.CreateProduto(produtoReq)

	return c.Status(res.Status).JSON(res)
}

func (ph *ProdutoHandler) FindAllProdutosHandler(c *fiber.Ctx) error {
	res := ph.service.FindAllProdutos()

	return c.Status(res.Status).JSON(res)
}

func (ph *ProdutoHandler) UpdateProdutoHandler(c *fiber.Ctx) error {
	produtoReq := new(produto.ProdutoReq)
	if err := c.BodyParser(produtoReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewErrorResponse(err, fiber.ErrBadRequest))
	}

	produtoID, _ := strconv.Atoi(c.Params("id", "0"))

	res := ph.service.UpdateProduto(uint(produtoID), produtoReq)

	return c.Status(res.Status).JSON(res)
}

func (ph *ProdutoHandler) DeleteProdutoHandler(c *fiber.Ctx) error {
	produtoID, _ := strconv.Atoi(c.Params("id", "0"))

	res := ph.service.DeleteProduto(uint(produtoID))

	return c.Status(res.Status).JSON(res)
}

func (ph *ProdutoHandler) SaidaProdutosHandler(c *fiber.Ctx) error {
	req := struct {
		Items []produto.ProdutoSaidaItem `json:"items"`
	}{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewErrorResponse(err, fiber.ErrBadRequest))
	}

	res := ph.service.ProcessSaida(req.Items)

	return c.Status(res.Status).JSON(res)
}
