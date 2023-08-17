import { Controller, Get } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagEntity } from './tag.entity'
import { TagsResponseInterface } from './dto/tagsResponse.interface';

@Controller('/tags/')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  async findAll(): Promise<TagsResponseInterface> {
    const tags = await this.tagService.findAll()
    return { tags: tags.map(tag => tag.name) };
  }
}
