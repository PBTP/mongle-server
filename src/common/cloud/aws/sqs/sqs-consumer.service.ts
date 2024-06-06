import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from 'aws-sdk/clients/sqs';
import { plainToInstance as toDto } from 'class-transformer';
import { S3EventDetailDto } from './dto/s3-image-created-event-message.dto';
import { MessageConsumer } from '../../cloud.message.broker.interface';
import { ImageService } from '../../../image/image.service';
import { Images } from '../../../image/image.entity';
import { validateOrReject as validation } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';

const sqsName = {
  s3ImageCreated: 's3-image-object-created',
};

@Injectable()
export class SqsConsumer implements MessageConsumer {
  private readonly s3ImageObjectCreated: string = 's3-image-object-created';
  private readonly logger: Logger = new Logger(SqsConsumer.name);
  private readonly sqs: SQS = new SQS({
    region: this.configService.get<string>('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_IAM_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>(
        'AWS_IAM_SECRET_ACCESS_KEY',
      ),
    },
  });

  constructor(
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {}

  @SqsMessageHandler(sqsName.s3ImageCreated, false)
  public async consumeMessage(message: Message): Promise<Images> {
    this.messageLog(sqsName.s3ImageCreated, message, 'received');

    if (!message.Body) {
      this.logger.warn(`Message body is empty`);
      return;
    }

    const s3Event = toDto(S3EventDetailDto, JSON.parse(message.Body));
    await validation(s3Event);

    const imageKey = s3Event.detail.object.key;
    const uuid = imageKey.match(/images\/([^/]+)\//)[1];

    return await this.imageService
      .create({
        uuid: uuid,
        imageLink: `https://image.mgmg.life/${imageKey}`,
      })
      .then((v) => {
        this.messageLog(sqsName.s3ImageCreated, message, 'success');
        this.sqs.deleteMessage(
          {
            QueueUrl: this.configService.get<string>(
              'sqs/url/s3-image-object-created',
            ),
            ReceiptHandle: message.ReceiptHandle,
          },
          (err, data) => {
            if (err) {
              this.logger.error(
                `Error occurred while deleting message: ${err}`,
              );
              this.logger.error(`data: ${data}`);
            }
            this.messageLog(sqsName.s3ImageCreated, message, 'deleted');
          },
        );
        return v;
      });
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
