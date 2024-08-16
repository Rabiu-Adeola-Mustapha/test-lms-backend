/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryProvider } from './cloudinary';

@Module({
  imports :[],
  providers: [FileUploadService, CloudinaryProvider ],
  exports: [FileUploadService, CloudinaryProvider],
})
export class FileUploadModule {}
