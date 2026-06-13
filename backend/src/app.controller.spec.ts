import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get(AppController);
  });

  it('GET / responde com { message: "English Dictionary" }', () => {
    expect(controller.index()).toEqual({ message: 'English Dictionary' });
  });
});
