package config

import (
	"log"
	"os"

	"github.com/spf13/viper"
)

func init() {
	log.Println("Initializing configuration setup")
	env := os.Getenv("ENVIRONMENT")
	if env == "" || env == "DEVELOPMENT" {
		viper.SetConfigFile(".env")
		if err := viper.ReadInConfig(); err != nil {
			log.Panicf("Error reading config file, %s", err)
		}
		viper.SetDefault("ENVIRONMENT", "DEVELOPMENT")
	}

	if env == "PRODUCTION" {
		viper.AutomaticEnv()
	}

}

type Config struct {
	Environment string
	Port        string
	Prefork     bool
	DBURL       string
	JWTSecret   string
	EstoqueURL  string
}

var config *Config

func LoadConfig() {
	config = &Config{
		Environment: viper.GetString("ENVIRONMENT"),
		Port:        viper.GetString("PORT"),
		Prefork:     viper.GetBool("PREFORK"),
		DBURL:       viper.GetString("DATABASE_URL"),
		JWTSecret:   viper.GetString("JWT_SECRET"),
		EstoqueURL:  viper.GetString("ESTOQUE_URL"),
	}
}

func GetConfig() *Config {
	return config
}
