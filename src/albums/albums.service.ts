import { Injectable, Logger } from '@nestjs/common';
import { DatasourceService } from '@src/datasource/datasource.service';
import { GetAlbumByIdCriteriaDto } from './dto/get-albums-by-id.dto';
import { Prisma } from '@prisma/client';
import * as dto from '@src/dto/album.dto';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';
import {
  SearchAlbumCriteriaDto,
  SearchAlbumResult,
} from './dto/search-albums-by-criteria.dto';
import {
  getPaginationObject,
  getPaginationQueryObject,
} from '@src/utils/pagination-utils';
import { getOrderBy } from '@src/utils/sorting-utils';

@Injectable()
export class AlbumsService {
  private readonly logger = new Logger(AlbumsService.name);
  constructor(
    private datasourceService: DatasourceService,
    private albumMapperService: AlbumMapperService,
  ) {}

  /**
   * Field mapping for sorting string to actual fields
   */
  FIELD_MAPPING = {
    albumName: (orderDirection: string) => ({
      title: orderDirection,
    }),
  };

  async searchAlbums(
    query: SearchAlbumCriteriaDto,
  ): Promise<SearchAlbumResult> {
    const { year, keyword, page, limit } = query;

    const selectFields = this.getSelectFields(query);
    const pagination = getPaginationQueryObject({ page, limit });
    const orderBy = getOrderBy<
      SearchAlbumCriteriaDto,
      Prisma.AlbumOrderByWithRelationInput
    >(query, this.FIELD_MAPPING);

    const whereCriteria: Prisma.AlbumWhereInput = {
      ...(year
        ? {
            songs: {
              some: {
                year,
              },
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } }, // Search in song title
              {
                songs: {
                  some: {
                    title: { contains: keyword, mode: 'insensitive' },
                  },
                },
              },
              {
                songs: {
                  some: {
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
                },
              },
              {
                songs: {
                  some: {
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
                },
              },
            ],
          }
        : {}),
    };

    const [albums, total] = await Promise.all([
      this.datasourceService.album.findMany({
        select: selectFields,
        where: whereCriteria,
        orderBy,
        ...pagination,
      }),
      this.datasourceService.album.count({
        where: whereCriteria,
      }),
    ]);

    const albumsDto = this.albumMapperService.transformAlbumsDbToDto(
      albums,
      pagination.skip,
    );

    return {
      data: albumsDto,
      pagination: getPaginationObject({ data: albumsDto, total, page, limit }),
    };
  }

  /**
   * Get album by id
   * @param id id of the album
   * @param query {@link GetAlbumByIdCriteriaDto}
   * @returns list of {@link dto.Album}
   */
  async getAlbumById(
    id: number,
    query: GetAlbumByIdCriteriaDto,
  ): Promise<dto.Album> {
    this.logger.log(
      `Get album by id ${id} with criteria: ${JSON.stringify(query)}`,
    );
    const selectFields = this.getSelectFields(query);
    const result = await this.datasourceService.album.findUnique({
      select: selectFields,
      where: { id },
    });
    return this.albumMapperService.convertAlbumToDto(result, result?.songs);
  }

  /**
   * Get song fields for by {@link GetAlbumByIdCriteriaDto}
   * @param query parameter
   * @returns {@link Prisma.AlbumSelect}
   */
  private getSelectFields({
    includeSongData,
  }: {
    includeSongData?: boolean;
  }): Prisma.AlbumSelect {
    return {
      id: true,
      title: true,
      ...this.getSongsSelect(includeSongData),
    };
  }

  /**
   * Get select fields
   * @param includeSongData the flag to determine whether or not to include songs
   * @returns {@link Prisma.AlbumSelect}
   */
  private getSongsSelect(includeSongData: boolean): Prisma.AlbumSelect {
    return includeSongData
      ? {
          songs: {
            select: {
              id: true,
              title: true,
              totalPlays: true,
              year: true,
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
        }
      : {};
  }
}
