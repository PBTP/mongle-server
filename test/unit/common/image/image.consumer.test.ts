import { ImageConsumer } from '../../../../src/common/image/application/image.consumer';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { Message } from 'aws-sdk/clients/sqs';
import { BadRequestException } from '@nestjs/common/exceptions';
import { FakeConfigService } from '../../../mock/fake.config.service';
import { FakeCloudStorage } from '../../../mock/fake.cloud-storage';
import { FakeImageRepository } from '../../../mock/fake.image.repository';

describe('ImageConsumer', () => {
  let consumer: ImageConsumer;

  beforeEach(() => {
    consumer = new ImageConsumer(
      new ImageService(new FakeCloudStorage(), new FakeImageRepository()),
      new FakeConfigService(),
    );
  });

  test('consumeMessage', async () => {
    // given
    const uuid = 'test-uuid';
    const env = `test`;

    const message = {
      Body: JSON.stringify({
        version: '2.0',
        id: 'test-id',
        source: 'aws:s3',
        account: '123456789012',
        time: '2023-10-01T12:00:00Z',
        region: 'us-east-1',
        resources: ['arn:aws:s3:::example-bucket'],
        detail: {
          version: '2.0',
          bucket: {
            name: 'example-bucket',
          },
          object: {
            key: `${env}/images/${uuid}/image.jpg`,
            size: 1024,
            etag: 'd41d8cd98f00b204e9800998ecf8427e',
            sequencer: '0055AED6DCD90281E5',
          },
          requester: 'arn:aws:iam::123456789012:user/test-user',
          reason: 'PutObject',
        },
      }),
    } as unknown as Message;

    // when
    const result = await consumer.consumeMessage(message);

    // then
    console.table(result);
    expect(result).toEqual({
      imageUrl: `https://image.mgmg.life/${env}/images/${uuid}/image.jpg`,
      uuid: uuid,
    });
  });

  test('consumeMessage with empty message body', async () => {
    // given
    const message = {
      Body: '',
    } as unknown as Message;

    // when && then
    await expect(consumer.consumeMessage(message)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('Message 안 object key에 대해 /images 와 파일명 사이에 uuid가 존재하지 않으면 BadRequestException 발생 ', async () => {
    // given
    const env = 'test';
    const message = {
      Body: JSON.stringify({
        version: '2.0',
        id: 'test-id',
        source: 'aws:s3',
        account: '123456789012',
        time: '2023-10-01T12:00:00Z',
        region: 'us-east-1',
        resources: ['arn:aws:s3:::example-bucket'],
        detail: {
          version: '2.0',
          bucket: {
            name: 'example-bucket',
          },
          object: {
            key: `${env}/images//image.jpg`,
            size: 1024,
            etag: 'd41d8cd98f00b204e9800998ecf8427e',
            sequencer: '0055AED6DCD90281E5',
          },
          requester: 'arn:aws:iam::123456789012:user/test-user',
          reason: 'PutObject',
        },
      }),
    } as unknown as Message;

    // when && then
    await expect(consumer.consumeMessage(message)).rejects.toThrow(
      BadRequestException,
    );
  });
});
