import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check if the application is running' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The server is running.',
    type: String,
  })
  getServerStatus(): string {
    return this.appService.getServerStatus();
  }
}
