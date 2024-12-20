import { Controller, Get, Query, Logger } from '@nestjs/common';
import { SongsService } from './songs.service';
import {
  SearchSongCriteriaDto,
  SearchSongCriteriaSchema,
  SearchSongResult,
} from './dto/search-songs.dto';
// import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ZodValidate } from '@src/pipes/zod-validation-pipe';
import { SearchSongSwaggerDto } from './swagger/search-songs.swagger';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Get('')
  @ZodValidate(SearchSongCriteriaSchema)
  @SearchSongSwaggerDto()
  async searchSongs(
    @Query() query: SearchSongCriteriaDto,
  ): Promise<SearchSongResult> {
    this.logger.log(`Search songs with criteria: ${JSON.stringify(query)}`);
    return this.songsService.searchSongs(query);
  }
}
