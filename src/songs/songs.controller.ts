import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Logger,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongCriteriaSchema,
  SearchSongResult,
} from './dto/search-songs.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Get('')
  @ApiOperation({
    summary: 'Search songs',
    description:
      'Retrieve a list of songs based on search criteria such as year, keyword, and more.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year of release (e.g., 2020). Must be a 4-digit number.',
    example: 2009,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Search keyword for song or album title (case insensitive).',
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
      'Comma-separated list of fields to sort by (e.g., "year,albumName").',
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
    this.logger.log(`Search criteria: `, query);
    // Validate the query parameters
    const result = SearchSongCriteriaSchema.safeParse(query);
    this.logger.log(result);
    if (!result.success) {
      this.logger.log(result.error.errors.map((e) => e.message));
      throw new BadRequestException(result.error.errors.map((e) => e.message));
    }

    const criteria = result.data;
    return this.songsService.searchSongs(criteria);
  }
}
