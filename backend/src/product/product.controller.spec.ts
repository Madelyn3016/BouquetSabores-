import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;

    const productEntity = { id: 1, name: 'Prod', description: 'Desc', price: 10, stock: 5, image: '', user: { id: 1 }, category: { id: 1 } };
    const serviceMock = {
        create: jest.fn().mockResolvedValue(productEntity),
        findAll: jest.fn().mockResolvedValue([productEntity]),
        findOne: jest.fn().mockResolvedValue(productEntity),
        update: jest.fn().mockResolvedValue({ ...productEntity, name: 'Updated' }),
        remove: jest.fn().mockResolvedValue({ message: 'Producto eliminado' }),
    } as unknown as ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                { provide: ProductService, useValue: serviceMock },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should call service and return product', async () => {
        const dto: CreateProductDto = { name: 'Prod', description: 'Desc', price: 10, stock: 5, image: '', userId: 1, categoryId: 1 };
        const result = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(productEntity);
    });

    it('findAll should return array', async () => {
        const result = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([productEntity]);
    });

    it('findOne should return product', async () => {
        const result = await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(productEntity);
    });

    it('update should modify product name', async () => {
        const dto: UpdateProductDto = { name: 'Updated' } as any;
        const result = await controller.update(1, dto);
        expect(service.update).toHaveBeenCalledWith(1, dto);
        expect(result.name).toBe('Updated');
    });

    it('remove should return message', async () => {
        const result = await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: 'Producto eliminado' });
    });
});