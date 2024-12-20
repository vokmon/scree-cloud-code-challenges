import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import { IncludeSongDataSchema } from './dto/albums.dto';
import { GetAlbumByIdCriteriaDto } from './dto/get-albums-by-id.dto';
import { Album } from '@src/dto/album.dto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('albums')
export class AlbumsController {
  private readonly logger = new Logger(AlbumsController.name);

  constructor(private readonly albumsService: AlbumsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get album by ID',
    description:
      'Retrieve an album by its unique ID. Optionally, include songs in the album ',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the album to retrieve',
  })
  @ApiQuery({
    name: 'includeSongData',
    type: Boolean,
    required: false,
    description:
      'Whether to include song data in the response (true or false). Default is false.',
  })
  async getAlbumById(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ZodValidationPipe(IncludeSongDataSchema))
    query: GetAlbumByIdCriteriaDto,
  ): Promise<Album> {
    this.logger.log(
      `Get album by id ${id} with criteria: ${JSON.stringify(query)}`,
    );
    return this.albumsService.getAlbumById(id, query);
  }
}
