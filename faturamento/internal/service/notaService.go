package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/OzyKleyton/Korp_Teste_Ozy/config"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model/nota"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/repository"
)

type NotaFiscalService interface {
	CreateNotaFiscal(notaReq *nota.NotaFiscalReq) *model.Response
	FindAllNotas(page, limit int) *model.Response
	FindNotaByID(id uint) *model.Response
	ImprimirNota(id uint) *model.Response
}

type NotaFiscalServiceImpl struct {
	repo repository.NotaFiscalRepository
}

func NewNotaFiscalService(repo repository.NotaFiscalRepository) NotaFiscalService {
	return &NotaFiscalServiceImpl{
		repo: repo,
	}
}

func (ns *NotaFiscalServiceImpl) CreateNotaFiscal(notaReq *nota.NotaFiscalReq) *model.Response {
	if notaReq.Status == "" {
		notaReq.Status = "Aberta"
	}

	if notaReq.NumeroSequencial == 0 {
		ultimo, err := ns.repo.GetLastNumeroSequencial()
		if err != nil {
			return model.NewErrorResponse(err, 500)
		}
		notaReq.NumeroSequencial = ultimo + 1
	}

	if notaReq.Status != "Aberta" && notaReq.Status != "Fechada" {
		notaReq.Status = "Aberta"
	}

	notaFiscal := notaReq.ToNotaFiscal()

	createNota, err := ns.repo.Create(notaFiscal)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	return model.NewSuccessResponse(createNota.ToNotaFiscalRes())
}

func (ns *NotaFiscalServiceImpl) FindAllNotas(page, limit int) *model.Response {
	notas, total, err := ns.repo.FindAll(page, limit)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	notasResponse := make([]*nota.NotaFiscalRes, 0, len(notas))
	for _, n := range notas {
		notasResponse = append(notasResponse, n.ToNotaFiscalRes())
	}

	return model.NewSuccessResponse(model.NewPaginationData(notasResponse, total))
}

func (ns *NotaFiscalServiceImpl) FindNotaByID(id uint) *model.Response {
	notaFiscal, err := ns.repo.FindByID(id)
	if err != nil {
		return model.NewErrorResponse(err, 404)
	}

	return model.NewSuccessResponse(notaFiscal.ToNotaFiscalRes())
}

func (ns *NotaFiscalServiceImpl) ImprimirNota(id uint) *model.Response {
	notaFiscal, err := ns.repo.FindByID(id)
	if err != nil {
		return model.NewErrorResponse(err, 404)
	}

	if notaFiscal.Status != "Aberta" {
		return model.NewErrorResponse(fmt.Errorf("nota fiscal deve estar com status Aberta para ser impressa"), 400)
	}

	if len(notaFiscal.Itens) > 0 {
		if err := ns.processSaida(notaFiscal.Itens); err != nil {
			return model.NewErrorResponse(err, 500)
		}
	}

	notaFiscal.Status = "Fechada"
	updatedNota, err := ns.repo.Update(notaFiscal)
	if err != nil {
		return model.NewErrorResponse(err, 500)
	}

	return model.NewSuccessResponse(updatedNota.ToNotaFiscalRes())
}

type estoqueSaidaItem struct {
	ProdutoID  uint  `json:"produto_id"`
	Quantidade int64 `json:"quantidade"`
}

type estoqueSaidaRequest struct {
	Items []estoqueSaidaItem `json:"items"`
}

func (ns *NotaFiscalServiceImpl) processSaida(itens []nota.ItemNota) error {
	requestItems := make([]estoqueSaidaItem, 0, len(itens))
	for _, item := range itens {
		requestItems = append(requestItems, estoqueSaidaItem{
			ProdutoID:  item.ProdutoID,
			Quantidade: item.Quantidade,
		})
	}

	body, err := json.Marshal(estoqueSaidaRequest{Items: requestItems})
	if err != nil {
		return err
	}

	estoqueURL := config.GetConfig().EstoqueURL
	if estoqueURL == "" {
		estoqueURL = "http://estoque-api:8000"
	}

	endpoint := strings.TrimRight(estoqueURL, "/") + "/api/v1/produtos/saida"
	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		var remote model.Response
		if err := json.NewDecoder(resp.Body).Decode(&remote); err == nil && remote.Message != "" {
			return fmt.Errorf("estoque: %s", remote.Message)
		}
		return fmt.Errorf("estoque: %s", resp.Status)
	}

	var remote model.Response
	if err := json.NewDecoder(resp.Body).Decode(&remote); err != nil {
		return err
	}

	if remote.Status != 200 {
		return fmt.Errorf("estoque: %s", remote.Message)
	}

	return nil
}
