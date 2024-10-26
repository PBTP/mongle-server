import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from 'aws-sdk/clients/sqs';
import { S3EventDetailDto } from '../../cloud/aws/sqs/presentation/s3-image-created-event-message.dto';
import { ImageService } from './image.service';
import { Image } from '../../../schemas/image.entity';
import { validateOrReject as validation } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { toDto } from '../../function/util.function';
import { BadRequestException } from '@nestjs/common/exceptions';

export const sqsName = {
  s3ImageCreated: 's3-image-object-created',
};

@Injectable()
export class ImageConsumer {
  private readonly logger: Logger = new Logger(ImageConsumer.name);
  private readonly sqs: SQS;

  constructor(
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {
    this.sqs = new SQS({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_IAM_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_IAM_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  @SqsMessageHandler(sqsName.s3ImageCreated, false)
  public async consumeMessage(message: Message): Promise<Image> {
    this.messageLog(sqsName.s3ImageCreated, message, 'received');

    if (!message.Body) {
      this.logger.warn(`Message body is empty`);
      throw new BadRequestException('Message body is empty');
    }

    const s3Event = toDto(S3EventDetailDto, JSON.parse(message.Body));
    await validation(s3Event);

    const imageKey = s3Event.detail.object.key;
    const match = imageKey.match(/images\/([^/]+)\//);

    if (!match) {
      this.logger.warn(`Image key does not match the expected pattern`);
      throw new BadRequestException(
        'Image key does not match the expected pattern',
      );
    }

    const uuid = match[1];

    return await this.imageService
      .create({
        uuid: uuid,
        imageUrl: `https://image.mgmg.life/${imageKey}`,
      })
      .then((v) => {
        this.messageLog(sqsName.s3ImageCreated, message, 'success');
        this.deleteMessage(sqsName.s3ImageCreated, message);
        return v;
      });
  }

  private deleteMessage(queueName: string, message: SQS.Message) {
    this.sqs.deleteMessage(
      {
        QueueUrl: <string>this.configService.get(`sqs/url/${queueName}`),
        ReceiptHandle: message.ReceiptHandle!,
      },
      (err, data) => {
        if (err) {
          this.logger.error(`Error occurred while deleting message: ${err}`);
          this.logger.error(`data: ${data}`);
        }
        this.messageLog(sqsName.s3ImageCreated, message, 'deleted');
      },
    );
  }

  @SqsConsumerEventHandler('s3-image-object-created', 'error')
  public async errorHandler(error: Error, message: Message): Promise<void> {
    this.logger.error(
      `Error occurred while processing message: ${message.MessageId}`,
    );
  }

  public messageLog(queueName: string, message: Message, status: string): void {
    this.logger.log(
      `${queueName?.toUpperCase()} Message(${message?.MessageId}) ${status}`,
    );
  }
}
