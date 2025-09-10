import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import compression from "compression"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))

  const configService = app.get(ConfigService)
  const port = configService.get("PORT") || 3001
  const frontendUrl = configService.get("FRONTEND_URL") || "http://localhost:3000"

  // Security
  app.use(helmet())
  app.use(compression())

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS
  app.enableCors({
    origin: [frontendUrl, "http://localhost:3000", "https://multivus.local"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle("MULTIVUS OS API")
    .setDescription("Sistema de Gestão de Ordens de Serviço - API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Autenticação")
    .addTag("companies", "Empresas")
    .addTag("users", "Usuários")
    .addTag("customers", "Clientes")
    .addTag("work-orders", "Ordens de Serviço")
    .addTag("inventory", "Estoque")
    .addTag("financial", "Financeiro")
    .addTag("notifications", "Notificações")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "MULTIVUS OS API",
    customCss: ".swagger-ui .topbar { display: none }",
  })

  await app.listen(port, "0.0.0.0")
  console.log(`🚀 MULTIVUS OS Backend running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
