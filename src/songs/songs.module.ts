import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';

@Module({
  imports: [DatasourceModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
