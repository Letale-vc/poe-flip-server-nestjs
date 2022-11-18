import { Test, TestingModule } from '@nestjs/testing';
import { PoeDataController } from './poe-data.controller';

describe('PoeDataController', () => {
  let controller: PoeDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoeDataController],
    }).compile();

    controller = module.get<PoeDataController>(PoeDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
