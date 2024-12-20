import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { SongMapperService } from '@src/mappers/song-mapper.dto';

@Module({
  imports: [DatasourceModule],
  controllers: [SongsController],
  providers: [SongsService, SongMapperService],
})
export class SongsModule {}
