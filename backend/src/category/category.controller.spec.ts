import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('CategoryController', () => {
    let controller: CategoryController;
    let service: CategoryService;

    const categoryEntity = { id: 1, name: 'Cat', description: 'Desc', user: { id: 1 } };
    const serviceMock = {
        create: jest.fn().mockResolvedValue(categoryEntity),
        findAll: jest.fn().mockResolvedValue([categoryEntity]),
        findOne: jest.fn().mockResolvedValue(categoryEntity),
        update: jest.fn().mockResolvedValue({ ...categoryEntity, name: 'Updated' }),
        remove: jest.fn().mockResolvedValue({ message: 'Categoría eliminada' }),
    } as unknown as CategoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                { provide: CategoryService, useValue: serviceMock },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<CategoryController>(CategoryController);
        service = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should return category', async () => {
        const dto: CreateCategoryDto = { name: 'Cat', description: 'Desc', userId: 1 };
        const result = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(categoryEntity);
    });

    it('findAll should return list', async () => {
        const result = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([categoryEntity]);
    });

    it('findOne should return category', async () => {
        const result = await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(categoryEntity);
    });

    it('update should modify name', async () => {
        const dto: UpdateCategoryDto = { name: 'Updated' } as any;
        const result = await controller.update(1, dto);
        expect(service.update).toHaveBeenCalledWith(1, dto);
        expect(result.name).toBe('Updated');
    });

    it('remove should return message', async () => {
        const result = await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: 'Categoría eliminada' });
    });
});