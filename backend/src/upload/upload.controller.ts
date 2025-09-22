import { Controller, Post, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('signature')
  @UseGuards(AuthGuard('jwt'))
  getSignature() {
    return this.uploadService.getSignature();
  }
}
