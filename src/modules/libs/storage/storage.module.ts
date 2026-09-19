import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService]
})
@Global() 
export class StorageModule {}
