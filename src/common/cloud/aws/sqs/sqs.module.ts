import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsConsumer } from './sqs-consumer.service';

@Module({
  imports: [
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          consumers: [
            {
              name: 's3-image-object-created',
              queueUrl: configService.get<string>(
                'sqs/url/s3-image-object-created',
              ),
              region: configService.get<string>('AWS_REGION'),
              sqs: new SQSClient({
                region: configService.get<string>('AWS_REGION'),
                credentials: {
                  accessKeyId: configService.get<string>(
                    'AWS_IAM_ACCESS_KEY_ID',
                  ),
                  secretAccessKey: configService.get<string>(
                    'AWS_IAM_SECRET_ACCESS_KEY',
                  ),
                },
              }),
            },
          ],
        };
      },
    }),
  ],
  providers: [SqsConsumer],
  exports: [SqsConsumer],
})
export class SQSModule {}
