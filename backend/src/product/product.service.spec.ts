import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const productArray = [
    {
        id: 1,
        name: 'Test Product',
        price: 10,
        stock: 5,
        description: 'desc',
        image: '',
        user: { id: 1 },
        category: { id: 1 },
    },
];

const mockProductRepo = () => ({
    find: jest.fn().mockResolvedValue(productArray),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
        .fn()
        .mockImplementation((product) => Promise.resolve({ id: 1, ...product })),
    remove: jest.fn().mockResolvedValue({}),
});

describe('ProductService', () => {
    let service: ProductService;
    let repo: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: getRepositoryToken(Product), useFactory: mockProductRepo },
            ],
        }).compile();
        service = module.get<ProductService>(ProductService);
        repo = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const products = await service.findAll();
            expect(products).toEqual(productArray);
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(productArray[0]);
            const product = await service.findOne(1);
            expect(product).toEqual(productArray[0]);
        });
        it('should throw NotFoundException if product not found', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new product', async () => {
            (repo.create as jest.Mock).mockImplementation((dto) => dto);
            (repo.save as jest.Mock).mockImplementation((product) =>
                Promise.resolve({ id: 1, ...product }),
            );
            const dto = {
                name: 'Test',
                price: 10,
                stock: 5,
                description: 'desc',
                image: '',
                userId: 1,
                categoryId: 1,
            };
            const product = await service.create(dto as any);
            expect(product).toHaveProperty('id');
            expect(product.name).toBe(dto.name);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(productArray[0]);
            (repo.save as jest.Mock).mockImplementation((product) =>
                Promise.resolve(product),
            );
            const dto = { name: 'Updated' };
            const product = await service.update(1, dto as any);
            expect(product.name).toBe('Updated');
        });
    });

    describe('remove', () => {
        it('should remove a product', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(productArray[0]);
            (repo.remove as jest.Mock).mockResolvedValue({});
            const result = await service.remove(1);
            expect(result).toHaveProperty('message');
        });
    });
});
