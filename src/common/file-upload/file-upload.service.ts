/* eslint-disable prettier/prettier */
// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import {  v2, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload-ts';
//import { CloudinaryResponse } from './cloudinary-response'; 
import * as  streamifier from 'streamifier';

@Injectable()
export class FileUploadService {
  uploadFile(file: Buffer): Promise<UploadApiResponse> {

  
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          folder: 'uploads',
        },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file).pipe(uploadStream);
    });
  }

  async uploadAvatarCloud(file: FileUpload): Promise<any> {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    
    try {
      const result = await new Promise((resolve, reject) => {
        const cloudStream = v2.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        stream.pipe(cloudStream);
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  }
}

