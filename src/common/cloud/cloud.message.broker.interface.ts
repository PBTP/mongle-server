import { Message } from 'aws-sdk/clients/sqs';
import { Images } from '../image/image.entity';

export interface MessageConsumer {
  consumeMessage(message: Message): Promise<Images>;
}
