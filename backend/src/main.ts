import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS configuration
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://multivus.local",
      "http://admin.multivus.local",
      "http://portal.multivus.local",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("MULTIVUS OS API")
    .setDescription("Sistema de Gestão de Ordens de Serviço - API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Autenticação")
    .addTag("companies", "Empresas")
    .addTag("users", "Usuários")
    .addTag("work-orders", "Ordens de Serviço")
    .addTag("customers", "Clientes")
    .addTag("inventory", "Estoque")
    .addTag("financial", "Financeiro")
    .addTag("notifications", "Notificações")
    .addTag("reports", "Relatórios")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3001
  await app.listen(port, "0.0.0.0")

  console.log(`🚀 MULTIVUS OS Backend running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
