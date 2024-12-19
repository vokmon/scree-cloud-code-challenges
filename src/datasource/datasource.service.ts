import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatasourceService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   super({
  //     log: ['query'], // Enable query logging
  //   });
  // }
  async onModuleInit() {
    await this.$connect();
  }
}
