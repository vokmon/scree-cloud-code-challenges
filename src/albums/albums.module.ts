import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { SongMapperService } from '@src/mappers/song-mapper.dto';
import { AlbumMapperService } from '@src/mappers/album-mapper.dto';

@Module({
  imports: [DatasourceModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, SongMapperService, AlbumMapperService],
})
export class AlbumsModule {}
