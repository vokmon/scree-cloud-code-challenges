import { Injectable, Logger } from '@nestjs/common';
import { DatasourceService } from '@src/datasource/datasource.service';
import { GetAlbumByIdCriteriaDto } from './dto/get-albums-by-id.dto';
import { Prisma } from '@prisma/client';
import * as dto from '@src/dto/album.dto';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';

@Injectable()
export class AlbumsService {
  private readonly logger = new Logger(AlbumsService.name);
  constructor(
    private datasourceService: DatasourceService,
    private albumMapperService: AlbumMapperService,
  ) {}

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
   * @param query {@link GetAlbumByIdCriteriaDto}
   * @returns {@link Prisma.AlbumSelect}
   */
  private getSelectFields(query: GetAlbumByIdCriteriaDto): Prisma.AlbumSelect {
    const { includeSongData } = query;
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
