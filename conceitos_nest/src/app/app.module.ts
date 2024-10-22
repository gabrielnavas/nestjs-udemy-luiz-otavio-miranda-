import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceitoManualModule } from 'src/conceitos-manual/conceitos-manual.module';

@Module({
  imports: [ConceitoManualModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
