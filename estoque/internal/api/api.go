package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/config"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/config/db"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/api/handler"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/api/router"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/repository"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/service"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Run(host, port string) error {
	address := fmt.Sprintf("%s:%s", host, port)
	log.Println("Listen app in port ", address)

	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
		Prefork:     config.GetConfig().Prefork,
		ProxyHeader: fiber.HeaderXForwardedFor,
	})

	database, err := db.ConnectDB(config.GetConfig().DBURL)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	database = database.WithContext(ctx)

	if err := database.AutoMigrate(
		&produto.Produto{},
	); err != nil {
		return err
	}

	if err := seedProdutos(database, config.GetConfig().Environment); err != nil {
		return err
	}

	produtoRepo := repository.NewProdutoRepository(database)

	produtoService := service.NewProdutoService(produtoRepo)

	produtoHandler := handler.NewProdutoHandler(produtoService)

	router.SetupRouter(app, produtoHandler.Routes())

	c := make(chan os.Signal, 1)
	errc := make(chan error, 1)
	signal.Notify(c, syscall.SIGINT, syscall.SIGTERM, syscall.SIGHUP)
	go func() {
		<-c
		fmt.Println("Gracefully shutting down...")
		cancel()
		errc <- app.Shutdown()
	}()

	if err := app.Listen(address); err != nil {
		return err
	}

	err = <-errc

	return err
}

func seedProdutos(database *gorm.DB, environment string) error {
	env := strings.TrimSpace(strings.ToUpper(environment))
	sampleProdutos := []produto.Produto{
		{Codigo: "P001", Descricao: "Caneta azul", Saldo: 100},
		{Codigo: "P002", Descricao: "Caderno 100 folhas", Saldo: 50},
		{Codigo: "P003", Descricao: "Lápis HB", Saldo: 200},
	}

	if env == "" || env == "DEVELOPMENT" || env == "DEV" {
		log.Println("Dev seed: limpando produtos existentes e inserindo dados iniciais")
		if err := database.Unscoped().Where("1 = 1").Delete(&produto.Produto{}).Error; err != nil {
			return err
		}
		return database.Create(&sampleProdutos).Error
	}

	var count int64
	if err := database.Model(&produto.Produto{}).Count(&count).Error; err != nil {
		return err
	}
	if count == 0 {
		log.Println("Prod seed: nenhum produto encontrado, inserindo dados iniciais sem deletar")
		return database.Create(&sampleProdutos).Error
	}

	log.Println("Prod seed: produtos já existem, mantendo dados atuais")
	return nil
}
