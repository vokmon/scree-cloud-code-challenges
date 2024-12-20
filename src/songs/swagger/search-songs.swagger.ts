import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  searchSampleBadRequest,
  searchSampleData,
} from './data/search-sample-data';

export function SearchSongSwaggerDto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Search songs',
      description: `
  Retrieve a list of songs based on search criteria such as year, keyword, and more.
  
  ### 1. **List All Songs with Pagination**  
  Users can also list all songs with pagination.  
    **Example**:  
    GET /songs
  
  ### 2. **Search Songs by Keyword**  
  Users can search for songs using a keyword, which will be matched against song name, album name, writers, and artists.  
    **Example**:  
    GET /songs?keyword=Taylor&orderBy=totalPlays&orderDirection=asc&page=1&limit=10
  
  ### 3. **Find Songs by Year**  
  The API can be used to find songs released in a specific year, with options for sorting and pagination.
    **Example**:  
    GET /songs?year=2024&orderBy=totalPlays&orderDirection=desc&page=1&limit=10
  
  ### 4. **Find Songs by Keyword and Year**  
  The user may want to find which songs that featuring with Ed Sheeran in 2024
    **Example**:  
    GET /songs?year=2024&keyword=Ed Sheeran
  
  ### 5. **Include Play Data Statistics**  
  The API can include play data statistics by adding the 'includePlayData=true' query parameter.  
    **Example**:  
    GET /songs?keyword=love&includePlayData=true
  
        `,
    }),
    ApiQuery({
      name: 'year',
      required: false,
      description: 'Year of release (e.g., 2009). Must be a 4-digit number.',
      example: 2009,
    }),
    ApiQuery({
      name: 'keyword',
      required: false,
      description:
        'Search keyword for song or album title or writers or artists names (case insensitive).',
      example: 'love',
    }),
    ApiQuery({
      name: 'includePlayData',
      required: false,
      description:
        'Whether to include play data in the results. Default is false.',
      type: Boolean,
      example: false,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Pagination page number. Default is 1.',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of results per page. Default is 10. Maximum is 50.',
      example: 10,
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      description:
        'Comma-separated list of fields to sort by (e.g., "year,albumName"). The available fields are songName, albumName, year, totalPlays',
      example: 'year',
    }),
    ApiQuery({
      name: 'orderDirection',
      required: false,
      description: 'Sort direction: "asc" or "desc". Default is "asc".',
      example: 'asc',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'A list of songs with pagination',
      example: searchSampleData,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      example: searchSampleBadRequest,
    }),
  );
}
