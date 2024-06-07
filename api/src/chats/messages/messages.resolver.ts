import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from '../../auth/current-user.decorator';
import { TokenPayload } from '../../auth/token-payload.interface';
import { GetMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from '../../common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessageArgs: GetMessagesArgs,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(getMessageArgs);
  }

  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      const userId = context.req.user._id;
      const message: Message = payload.messageCreated;
      return (
        message.chatId === variables.chatId &&
        userId !== message.user._id.toHexString()
      );
    },
  })
  messageCreated(@Args() messageCreatedArgs: MessageCreatedArgs) {
    return this.messagesService.messageCreated(messageCreatedArgs);
  }
}
