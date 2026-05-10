package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"guyguy/backend/internal/config"
	"guyguy/backend/internal/routes"
	"guyguy/backend/pkg/logger"
)

func main() {
	cfg := config.Load()
	log := logger.New(cfg.AppEnv)
	defer func() { _ = log.Sync() }()

	router := routes.NewRouter(cfg, log)

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Info("backend server starting", logger.Fields("port", cfg.Port, "env", cfg.AppEnv)...)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("server failed", logger.Fields("error", err.Error())...)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Info("shutting down server")
	if err := srv.Shutdown(ctx); err != nil {
		log.Error("graceful shutdown failed", logger.Fields("error", err.Error())...)
	}
}
