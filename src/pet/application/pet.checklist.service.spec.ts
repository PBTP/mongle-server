import { Test, TestingModule } from '@nestjs/testing';
import { PetService } from './pet.service';

describe('PetChecklistService', () => {
  let service: PetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetService],
    }).compile();

    service = module.get<PetService>(PetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find checklist', () => {
    service.findCheckList(null, null).then((checklist) => {
      expect(checklist).toBeDefined();
    });
  });
});
