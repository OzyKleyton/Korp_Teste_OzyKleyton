package handler

import (
	"strconv"

	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/api/router"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model/nota"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/service"
	"github.com/gofiber/fiber/v2"
)

type NotaHandler struct {
	service service.NotaFiscalService
}

func NewNotaHandler(service service.NotaFiscalService) *NotaHandler {
	return &NotaHandler{
		service: service,
	}
}

func (nh *NotaHandler) Routes() router.Router {
	return func(route fiber.Router) {
		notas := route.Group("notas")
		notas.Post("/", nh.CreateNotaFiscalHandler)
		notas.Get("/", nh.FindAllNotasHandler)
		notas.Get("/:id", nh.FindNotaByIDHandler)
		notas.Post("/:id/imprimir", nh.ImprimirNotaHandler)
	}
}

func (nh *NotaHandler) CreateNotaFiscalHandler(c *fiber.Ctx) error {
	notaReq := new(nota.NotaFiscalReq)
	if err := c.BodyParser(notaReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.NewErrorResponse(err, fiber.ErrBadRequest))
	}

	res := nh.service.CreateNotaFiscal(notaReq)
	return c.Status(res.Status).JSON(res)
}

func (nh *NotaHandler) FindAllNotasHandler(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	res := nh.service.FindAllNotas(page, limit)
	return c.Status(res.Status).JSON(res)
}

func (nh *NotaHandler) FindNotaByIDHandler(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id", "0"))
	res := nh.service.FindNotaByID(uint(id))
	return c.Status(res.Status).JSON(res)
}

func (nh *NotaHandler) ImprimirNotaHandler(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id", "0"))
	res := nh.service.ImprimirNota(uint(id))
	return c.Status(res.Status).JSON(res)
}
