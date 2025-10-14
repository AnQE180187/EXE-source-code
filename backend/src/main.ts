import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://freeday.onrender.com'];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch(err => {
  console.error('Error starting application:', err);
  process.exit(1);
});
