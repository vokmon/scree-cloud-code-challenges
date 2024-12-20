import { Injectable } from '@nestjs/common';
import { Song } from '@prisma/client';
import * as dto from '@src/dto/song.dto';
import { getRecordIndex } from '@src/utils/pagination-utils';

@Injectable()
export class SongMapperService {
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
