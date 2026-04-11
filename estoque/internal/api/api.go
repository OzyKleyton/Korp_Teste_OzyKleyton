package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/config"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/config/db"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/api/handler"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/api/router"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/model/produto"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/repository"
	"github.com/OzyKleyton/Korp_Teste_OzyKleyton/internal/service"
	"github.com/gofiber/fiber/v2"
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

	db, err := db.ConnectDB(config.GetConfig().DBURL)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	db = db.WithContext(ctx)

	if err := db.AutoMigrate(
		&produto.Produto{},
	); err != nil {
		return err
	}

	produtoRepo := repository.NewProdutoRepository(db)

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
