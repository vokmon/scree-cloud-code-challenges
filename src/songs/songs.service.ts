import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Song } from '@prisma/client';
import { DatasourceService } from '@src/datasource/datasource.service';
import {
  SearchSongCriteriaDto,
  SearchSongResult,
} from './dto/search-songs.dto';
import {
  getPaginationObject,
  getPaginationQueryObject,
  getRecordIndex,
} from '@src/utils/pagination-utils';
import { getOrderBy } from '@src/utils/sorting-utils';
import * as dto from '@src/dto/song.dto';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private datasourceService: DatasourceService) {}

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
    const orderBy = getOrderBy<
      SearchSongCriteriaDto,
      Prisma.SongOrderByWithRelationInput
    >(criteria, this.FIELD_MAPPING);

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

    const songsDto = this.transformSongDbToDto(songs, pagination.skip);
    return {
      data: songsDto,
      pagination: getPaginationObject({ data: songsDto, total, page, limit }),
    };
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
   * Convert song database entity to song dto
   * @param songs list of {@link Song} to convert
   * @param offset for setting index in the element
   * @returns list of {@link dto.Song}
   */
  transformSongDbToDto(songs: Song[], offset: number): dto.Song[] {
    const songsDto = songs.map((song, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return {
        index: getRecordIndex({ index, skip: offset }),
        ...song,
      } as unknown as dto.Song;
    });
    return songsDto;
  }
}
