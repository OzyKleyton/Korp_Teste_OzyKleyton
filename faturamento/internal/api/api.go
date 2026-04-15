package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/OzyKleyton/Korp_Teste_Ozy/config"
	"github.com/OzyKleyton/Korp_Teste_Ozy/config/db"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/api/handler"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/api/router"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/model/nota"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/repository"
	"github.com/OzyKleyton/Korp_Teste_Ozy/internal/service"
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
		&nota.NotaFiscal{},
		&nota.ItemNota{},
	); err != nil {
		return err
	}

	notaRepo := repository.NewNotaFiscalRepository(db)

	notaService := service.NewNotaFiscalService(notaRepo)
	notaHandler := handler.NewNotaHandler(notaService)

	router.SetupRouter(app, notaHandler.Routes())

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
