import { FakeCloudStorage } from "@mock/fake.cloud-storage";
import { ImageService } from "@common/image/application/image.service";
import { FakeImageRepository } from "@mock/fake.image.repository";

describe('ImageService', () => {
  let service: ImageService;
  let repo: FakeImageRepository;

  beforeEach(() => {
    repo = new FakeImageRepository();
    service = new ImageService(new FakeCloudStorage(), repo);
  });

  test('PreSignedUrl을 발급한다 ', async () => {
    // given
    const key = 'key';
    const metadata = [{ fileName: 'fileName', fileSize: 1 }];

    // when
    const result = await service.generatePreSignedUrls(key, metadata);

    // then
    console.table(result);
    expect(result).toEqual([
      {
        url: key,
        expiredTime: 60,
        fileName: 'fileName',
        fileSize: 1,
      },
    ]);
  });

  test('이미지를 저장한다.', async () => {
    // given
    const saveUrl = 'imageUrl';
    const dto = { imageUrl: saveUrl };

    // when
    const result = await service.create(dto);

    // then
    expect(result).toEqual({ imageUrl: saveUrl });
    repo.getOne({ imageUrl: saveUrl }).then((v) => {
      console.table(v);
      expect(v).toEqual({ imageUrl: saveUrl });
    });
  });
});
