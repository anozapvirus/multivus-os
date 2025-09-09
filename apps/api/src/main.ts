import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
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
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  })

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("MULTIVUS OS API")
    .setDescription("Sistema de Ordem de Serviço MULTIVUS - API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3001
  await app.listen(port, "0.0.0.0")

  console.log(`🚀 MULTIVUS OS API running on port ${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
