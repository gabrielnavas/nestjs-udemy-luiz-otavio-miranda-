import { Injectable } from '@nestjs/common';

import imageType from 'image-type';

@Injectable()
export class FileService {
  private readonly allowedMimeTypesImages = ['image/jpeg', 'image/png'];

  async validateImage(buffer: Buffer): Promise<boolean> {
    const result = await imageType(buffer);
    if(!result) {
      return false;
    }
    const type = result.mime;
    if (this.allowedMimeTypesImages.includes(type)) {
      return true;
    }
    return false;
  }
}
