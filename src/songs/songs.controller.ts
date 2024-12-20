import { Controller, Get, Query, Logger } from '@nestjs/common';
import { SongsService } from './songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongCriteriaSchema,
  SearchSongResult,
} from './dto/search-songs.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ZodValidate } from '@src/pipes/zod-validation-pipe';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Get('')
  @ZodValidate(SearchSongCriteriaSchema)
  @ApiOperation({
    summary: 'Search songs',
    description:
      'Retrieve a list of songs based on search criteria such as year, keyword, and more.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year of release (e.g., 2009). Must be a 4-digit number.',
    example: 2009,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description:
      'Search keyword for song or album title or writers or artists names (case insensitive).',
    example: 'love',
  })
  @ApiQuery({
    name: 'includePlayData',
    required: false,
    description:
      'Whether to include play data in the results. Default is false.',
    type: Boolean,
    example: false,
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
      'Comma-separated list of fields to sort by (e.g., "year,albumName"). The available fields are songName, albumName, year, totalPlays',
    example: 'year',
  })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    description: 'Sort direction: "asc" or "desc". Default is "asc".',
    example: 'asc',
  })
  async searchSongs(
    @Query() query: SearchSongCriteriaDto,
  ): Promise<SearchSongResult> {
    this.logger.log(`Search songs with criteria: ${JSON.stringify(query)}`);
    return this.songsService.searchSongs(query);
  }
}
