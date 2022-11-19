import { Test, TestingModule } from '@nestjs/testing';
import { PoeDataController } from './poe-data.controller';
import { PoeDataService } from './poe-data.service';

describe('PoeDataController', () => {
  let controller: PoeDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoeDataController],
      providers: [{ provide: PoeDataService, useValue: {} }],
    }).compile();

    controller = module.get<PoeDataController>(PoeDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
