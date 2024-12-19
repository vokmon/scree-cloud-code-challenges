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
  getRecordIndex,
} from '@src/utils/pagination-utils';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private datasourceService: DatasourceService) {}

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
   * @returns
   */
  async searchSongs(
    criteria: SearchSongCriteriaDto,
  ): Promise<SearchSongResult> {
    const { year, keyword, includePlayData, page, limit } = criteria;
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
        select: {
          id: true,
          title: true,
          year: true,
          totalPlays: true,
          album: { select: { title: true } },
          ...this.getPlaysSelection(includePlayData),
        },
        where: whereCriteria,
        orderBy,
        ...pagination,
      }),
      this.datasourceService.song.count({
        where: whereCriteria,
      }),
    ]);

    // Transform the database entity to dto object
    const songsDto = songs.map((song, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...rest } = song;
      return {
        index: getRecordIndex({ index, skip: pagination.skip }),
        ...rest,
      };
    });

    return {
      data: songsDto,
      pagination: getPaginationObject({ data: songsDto, total, page, limit }),
    };
  }

  private getPlaysSelection(includePlayData: boolean): Prisma.SongSelect {
    this.logger.log('Should include play data: ', includePlayData);
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
    this.logger.log('Create order by from: ', orderBy, orderDirection);
    const orderByCriteria = orderBy
      ? orderBy.map((field) => {
          const mapping = this.FIELD_MAPPING[field];
          if (mapping) {
            return mapping(orderDirection);
          }
        })
      : [];
    this.logger.log('Order by: ', orderByCriteria);
    return orderByCriteria;
  }
}
