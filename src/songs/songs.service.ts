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
import * as dto from './dto/songs.dto';
import { GetSongByIdCriteriaDto } from './dto/get-songs-by-id.dto';
import { GetRecommendationCriteriaDto } from './dto/get-recommendations.dto';
import { getRandomNumbers } from '@src/utils/number-utils';

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
    return {
      index: 1,
      ...song,
    };
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

    const songsDto = this.transformSongDbToDto(songs, 0);
    return songsDto;
  }

  private transformSongDbToDto(songs: Song[], offset: number): dto.Song[] {
    const songsDto = songs.map((song, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return {
        index: getRecordIndex({ index, skip: offset }),
        ...song,
      } as unknown as dto.Song;
    });
    return songsDto;
  }

  private getSongSelection(criteria: SearchSongCriteriaDto): Prisma.SongSelect {
    const { includePlayData } = criteria;
    return {
      title: true,
      year: true,
      totalPlays: true,
      album: { select: { title: true } },
      ...this.getPlaysSelection(includePlayData),
    };
  }

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
          },
        }
      : {};
  }

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
