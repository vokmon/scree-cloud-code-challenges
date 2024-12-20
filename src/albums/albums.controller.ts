import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import {
  SearchAlbumCriteriaDto,
  SearchAlbumCriteriaSchema,
  SearchAlbumResult,
} from './dto/search-albums-by-criteria.dto';

@Controller('albums')
export class AlbumsController {
  private readonly logger = new Logger(AlbumsController.name);

  constructor(private readonly albumsService: AlbumsService) {}

  @Get('')
  @ApiOperation({
    summary: 'Search for albums',
    description: 'Search for albums with criteria such as year, keyword, etc.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter albums by the release year.',
    type: String,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description:
      'Search albums by title, song title, song writer, or artist name.',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination.',
    type: Number,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of albums per page.',
    type: Number,
    default: 10,
  })
  @ApiQuery({
    name: 'includeSongData',
    type: Boolean,
    required: false,
    description:
      'Whether to include song data in the response (true or false). Default is false.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagination page number. Default is 1.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page. Default is 10. Maximum is 50.',
    example: 10,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Comma-separated list of fields to sort by (e.g., "albumName"). The available fields is albumName',
    example: 'albumName',
  })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    description: 'Sort direction: "asc" or "desc". Default is "asc".',
    example: 'asc',
  })
  async searchAlbums(
    @Query(new ZodValidationPipe(SearchAlbumCriteriaSchema))
    query: SearchAlbumCriteriaDto,
  ): Promise<SearchAlbumResult> {
    this.logger.log(`Search albums with criteria: ${JSON.stringify(query)}`);
    return this.albumsService.searchAlbums(query);
  }

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
    const album = await this.albumsService.getAlbumById(id, query);
    if (!album) {
      throw new HttpException('No Content', HttpStatus.NO_CONTENT);
    }
    return album;
  }
}
