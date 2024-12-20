import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatasourceService } from '@src/datasource/datasource.service';
import {
  SearchSongCriteriaDto,
  SearchSongResult,
} from './dto/search-songs.dto';
import {
  getPaginationObject,
  getPaginationQueryObject,
} from '@src/utils/pagination-utils';
import * as dto from '@src/dto/song.dto';
import { GetSongByIdCriteriaDto } from './dto/get-songs-by-id.dto';
import { GetRecommendationCriteriaDto } from './dto/get-recommendations.dto';
import { getRandomNumbers } from '@src/utils/number-utils';
import { GetTopSongsCriteriaDto, TopSongs } from './dto/get-top-songs.dto';
import { SongMapperService } from '@src/mappers/song-mapper.dto';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(
    private datasourceService: DatasourceService,
    private songMapperService: SongMapperService,
  ) {}

  /**
   * Field mapping for sorting string to actual fields
   */
  FIELD_MAPPING = {
    songName: (orderDirection: string) => ({
      title: orderDirection,
    }),
    albumName: (orderDirection: string) => ({
      album: {
        title: orderDirection,
      },
    }),
    year: (orderDirection: string) => ({
      year: orderDirection,
    }),
    totalPlays: (orderDirection: string) => ({
      totalPlays: orderDirection,
    }),
  };

  /**
   * Search songs by criteria
   * @param criteria of {@link SearchSongCriteriaDto}
   * @returns {@link SearchSongResult}
   */
  async searchSongs(
    criteria: SearchSongCriteriaDto,
  ): Promise<SearchSongResult> {
    const { year, keyword, page, limit } = criteria;
    const selectFields = this.getSongSelection(criteria);
    const pagination = getPaginationQueryObject({ page, limit });
    const orderBy = this.getOrderBy(criteria);

    const whereCriteria: Prisma.SongWhereInput = {
      ...(year ? { year } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } }, // Search in song title
              {
                album: {
                  is: { title: { contains: keyword, mode: 'insensitive' } }, // Search in album title
                },
              },
              {
                writers: {
                  some: {
                    writer: {
                      is: {
                        name: { contains: keyword, mode: 'insensitive' },
                      },
                    },
                  },
                },
              },
              {
                artists: {
                  some: {
                    artist: {
                      is: {
                        name: { contains: keyword, mode: 'insensitive' },
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [songs, total] = await Promise.all([
      this.datasourceService.song.findMany({
        select: selectFields,
        where: whereCriteria,
        orderBy,
        ...pagination,
      }),
      this.datasourceService.song.count({
        where: whereCriteria,
      }),
    ]);

    const songsDto = this.songMapperService.transformSongDbToDto(
      songs,
      pagination.skip,
    );
    return {
      data: songsDto,
      pagination: getPaginationObject({ data: songsDto, total, page, limit }),
    };
  }

  /**
   * Get song by song id
   * @param id song id
   * @param criteria {@link GetSongByIdCriteriaDto}
   * @returns The song that matched the id
   */
  async getSongById(
    id: number,
    criteria: GetSongByIdCriteriaDto,
  ): Promise<dto.Song | null> {
    const selectFields = this.getSongSelection(criteria);
    const song = await this.datasourceService.song.findUnique({
      select: {
        id: true,
        ...selectFields,
      },
      where: { id },
    });
    if (!song) {
      return null;
    }
    const dto = this.songMapperService.transformSongDbToDto([song], 0);
    return dto[0];
  }

  /**
   * This is a simplified example of a song recommendation system. In a real-world application, song recommendations would take many factors into account, such as:
   * - User preferences (e.g., genre, artists, etc.)
   * - Playlist history (songs previously added to playlists or liked by the user)
   * - Song release dates (new releases or songs that match the user's listening pattern)
   * - Current trends (popular songs, trending genres, etc.)
   *
   * For the purpose of this example, the method simply fetches a set of random songs from the database as a placeholder for a more sophisticated recommendation engine.
   *
   * @param query {@link GetRecommendationCriteriaDto}
   */
  async getRecommendationSongs(
    query: GetRecommendationCriteriaDto,
  ): Promise<dto.Song[]> {
    const selectFields = this.getSongSelection(query);
    const orderBy = this.getOrderBy(query);
    const { limit } = query;

    const totalCount = await this.datasourceService.song.count();
    const ids = getRandomNumbers(limit, totalCount);
    const songs = await this.datasourceService.song.findMany({
      select: selectFields,
      where: {
        id: {
          in: ids,
        },
      },
      orderBy,
      take: limit,
    });

    const songsDto = this.songMapperService.transformSongDbToDto(songs, 0);
    return songsDto;
  }

  async getTopSongsByMonths(
    criteria: GetTopSongsCriteriaDto,
  ): Promise<TopSongs[]> {
    const { monthYears, limit } = criteria;
    const results = [];

    for (const { month, year } of monthYears) {
      const topSongs = await this.datasourceService.play.findMany({
        select: {
          playCount: true,
          song: {
            select: {
              id: true,
              title: true,
              totalPlays: true,
              year: true,
              album: {
                select: {
                  id: true,
                  title: true,
                },
              },
              writers: {
                select: {
                  writer: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              artists: {
                select: {
                  artist: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          month,
          year,
        },
        orderBy: {
          playCount: 'desc',
        },
        take: limit,
      });

      results.push({
        month,
        year,
        topSongs,
      });
    }

    return results;
  }

  /**
   * Provide {@link Prisma.SongSelect} for common select statement
   * @param criteria {@link SearchSongCriteriaDto} to build the select object
   * @returns {@link Prisma.SongSelect}
   */
  private getSongSelection(criteria: SearchSongCriteriaDto): Prisma.SongSelect {
    const { includePlayData } = criteria;
    return {
      title: true,
      year: true,
      totalPlays: true,
      album: { select: { id: true, title: true } },
      writers: {
        select: {
          writer: {
            select: {
              name: true,
            },
          },
        },
      },
      artists: {
        select: {
          artist: {
            select: {
              name: true,
            },
          },
        },
      },
      ...this.getPlaysSelection(includePlayData),
    };
  }

  /**
   * Determin whether the plays data should be included in the select statement
   * @param includePlayData the flag to include or not
   * @returns select object for Play data
   */
  private getPlaysSelection(includePlayData: boolean): Prisma.SongSelect {
    this.logger.log(`Should include play data: ${includePlayData}`);
    return includePlayData
      ? {
          plays: {
            select: {
              month: true,
              year: true,
              playCount: true,
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            take: 12,
          },
        }
      : {};
  }

  /**
   * Get order by statement by {@link SearchSongCriteriaDto}
   * @param criteria {@link SearchSongCriteriaDto}
   * @returns {@link Prisma.SongOrderByWithRelationInput}
   */
  private getOrderBy(
    criteria: SearchSongCriteriaDto,
  ): Prisma.SongOrderByWithRelationInput[] {
    const { orderBy, orderDirection } = criteria;
    this.logger.log(
      `Create order by from: order by: ${orderBy}, order direction: ${orderDirection}`,
    );
    const orderByCriteria = orderBy
      ? orderBy.map((field) => {
          const mapping = this.FIELD_MAPPING[field];
          if (mapping) {
            return mapping(orderDirection);
          }
        })
      : [];
    this.logger.log(`Order by: ${JSON.stringify(orderByCriteria)}`);
    return orderByCriteria;
  }
}
