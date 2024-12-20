import { Injectable } from '@nestjs/common';
import { Album, Song } from '@prisma/client';
import * as dto from '@src/dto/album.dto';
import { SongMapperService } from './song-mapper.dto';

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
      songs: songs
        ? this.songMapperService.transformSongDbToDto(songs, 0)
        : undefined,
    };
    return albumDto;
  }
}
