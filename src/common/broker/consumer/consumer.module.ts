import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { sqsName } from '../../image/application/image.consumer';
import { SqsOptions } from '@ssut/nestjs-sqs/dist/sqs.types';

@Module({
  imports: [
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SqsOptions => {
        const sqsClient = new SQSClient({
          region: <string>configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: <string>(
              configService.get<string>('AWS_IAM_ACCESS_KEY_ID')
            ),
            secretAccessKey: <string>(
              configService.get<string>('AWS_IAM_SECRET_ACCESS_KEY')
            ),
          },
        });

        return {
          consumers: [
            {
              name: 's3-image-object-created',
              queueUrl: <string>(
                configService.get(`sqs/url/${sqsName.s3ImageCreated}`)
              ),
              region: <string>configService.get('AWS_REGION'),
              sqs: sqsClient,
            },
          ],
        };
      },
    }),
  ],
})
export class ConsumerModule {}
