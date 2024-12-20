import { Injectable } from '@nestjs/common';
import { Album, Song } from '@prisma/client';
import * as dto from '@src/dto/album.dto';
import { SongMapperService } from './song-mapper.dto';
import { getRecordIndex } from '@src/utils/pagination-utils';

@Injectable()
export class AlbumMapperService {
  constructor(private songMapperService: SongMapperService) {}

  /**
   * Convert album database entity to album dto
   * @param album {@link Album}
   * @param songs list of {@link Song} to convert
   * @param offset for setting index in the element
   * @returns list of {@link dto.Song}
   */
  convertAlbumToDto(album: Album, songs?: Song[]): dto.Album {
    if (!album) {
      return null;
    }
    const albumDto: dto.Album = {
      id: album.id,
      title: album.title,
    };
    if (songs) {
      albumDto.songs = this.songMapperService.transformSongDbToDto(songs, 0);
    }
    return albumDto;
  }

  /**
   * Convert album database entity to album dto
   * @param albums list of {@link Album} to convert
   * @param offset for setting index in the element
   * @returns list of {@link dto.Album}
   */
  transformAlbumsDbToDto(
    albums: (Album & { songs: Song[] })[],
    offset: number,
  ): dto.Album[] {
    return albums.map((album, index) => {
      const dto = this.convertAlbumToDto(album, album.songs);
      return {
        index: getRecordIndex({ index, skip: offset }),
        ...dto,
      };
    });
  }
}
