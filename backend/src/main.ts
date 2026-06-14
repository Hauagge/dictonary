import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const swaggerConfig = new DocumentBuilder()
    .setTitle("English Dictionary API")
    .setDescription("Dicionário de inglês com autenticação, histórico e favoritos")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build()
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, swaggerConfig))

  const port = Number(process.env.PORT ?? 3001)
  await app.listen(port)
  console.log(`[server] API rodando em http://localhost:${port}`)
}

bootstrap()
