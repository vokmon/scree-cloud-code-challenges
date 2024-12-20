import {
  Controller,
  Get,
  Query,
  Logger,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongCriteriaSchema,
  SearchSongResult,
} from './dto/search-songs.dto';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ZodValidate, ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import {
  GetSongByIdCriteriaDto,
  GetSongByIdCriteriaSchema,
} from './dto/get-songs-by-id.dto';
import {
  GetRecommendationSongsCriteriaDto,
  GetRecommendationSongsCriteriaSchema,
} from './dto/get-recommendation-songs.dto';
import {
  GetTopSongsCriteriaDto,
  GetTopSongsCriteriaSchema,
  TopSongs,
} from './dto/get-top-songs.dto';
import { Song } from '@src/dto/song.dto';

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

  @Get('/recommendations')
  @ZodValidate(GetRecommendationSongsCriteriaSchema)
  @ApiOperation({
    summary: 'Get recommended songs',
    description:
      'Retrieve a list of recommended songs based on random selection. This is a simplified example and does not account for real-world recommendation factors such as user preferences, playlists, or trends.',
  })
  @ApiQuery({
    name: 'includePlayData',
    type: String,
    required: false,
    description: 'Whether to include play data ("true" or "false").',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'The maximum number of recommended songs to retrieve.',
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
  async getRecommendationSongs(
    @Query()
    query: GetRecommendationSongsCriteriaDto,
  ): Promise<Song[]> {
    this.logger.log(
      `Get recommended songs with criteria: ${JSON.stringify(query)}`,
    );
    const songs = await this.songsService.getRecommendationSongs(query);
    return songs;
  }

  @Get('/top-songs-by-months')
  @ApiOperation({
    summary: 'Get top songs by month and year',
    description:
      'Fetches the top songs based on play counts for each specified month-year pair.',
  })
  @ApiQuery({
    name: 'monthYears',
    required: false,
    type: String,
    description:
      'Comma-separated list of month-year pairs in the format "YYYY-MM". Defaults to the current month if not provided.',
    example: '2024-01,2024-02',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'The maximum number of top songs to return for each month-year pair. Defaults to 10 if not provided.',
    example: 10,
  })
  async getTopSongsByMonths(
    @Query(new ZodValidationPipe(GetTopSongsCriteriaSchema))
    query: GetTopSongsCriteriaDto,
  ): Promise<TopSongs[]> {
    this.logger.log(
      `Get top songs by month with creteria: ${JSON.stringify(query)}`,
    );
    const result = await this.songsService.getTopSongsByMonths(query);
    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get song by ID',
    description:
      'This endpoint is useful when you know the ID of the song you want to retrieve. It allows you to fetch a specific song by its unique ID. The ID must be provided in the URL to identify the song.',
  }) // Description of the operation
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the song to retrieve',
  }) // Description for the `id` parameter
  @ApiQuery({
    name: 'includePlayData',
    type: Boolean,
    required: false,
    description:
      'Whether to include play data in the response (true or false). Default is false.',
  })
  async getSongById(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ZodValidationPipe(GetSongByIdCriteriaSchema))
    query: GetSongByIdCriteriaDto,
  ) {
    this.logger.log(
      `Get song by id ${id} with criteria: ${JSON.stringify(query)}`,
    );
    const song = await this.songsService.getSongById(id, query);
    if (!song) {
      throw new HttpException('No Content', HttpStatus.NO_CONTENT);
    }
    return song;
  }
}
