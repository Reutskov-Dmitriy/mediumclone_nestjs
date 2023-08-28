import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SharedService {
  public getSlug(title: string): string {
    return (slugify(title, { lower: true }) +
      '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    );
  }
}
