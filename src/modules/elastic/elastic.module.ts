import { Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';

@Module({
  controllers: [ElasticController],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
