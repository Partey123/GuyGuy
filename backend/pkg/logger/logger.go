package logger

import "go.uber.org/zap"

func New(appEnv string) *zap.Logger {
	if appEnv == "production" {
		l, _ := zap.NewProduction()
		return l
	}
	l, _ := zap.NewDevelopment()
	return l
}

func Fields(kv ...any) []zap.Field {
	fields := make([]zap.Field, 0, len(kv)/2)
	for i := 0; i+1 < len(kv); i += 2 {
		key, _ := kv[i].(string)
		fields = append(fields, zap.Any(key, kv[i+1]))
	}
	return fields
}
