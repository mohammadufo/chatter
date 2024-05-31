import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chat.repository';

@Module({
  providers: [ChatsResolver, ChatsService, ChatsRepository],
})
export class ChatsModule {}
