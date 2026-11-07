import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export function configureApp(app: INestApplication): void {
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true    
        })
    );

    app.enableCors({
        origin: configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000'
    });
}