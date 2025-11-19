import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const categoryArray = [
    { id: 1, name: 'Test Category', description: 'desc', user: { id: 1 } },
];

const mockCategoryRepo = () => ({
    find: jest.fn().mockResolvedValue(categoryArray),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
        .fn()
        .mockImplementation((category) => Promise.resolve({ id: 1, ...category })),
    remove: jest.fn().mockResolvedValue({}),
});

describe('CategoryService', () => {
    let service: CategoryService;
    let repo: Repository<Category>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: getRepositoryToken(Category), useFactory: mockCategoryRepo },
            ],
        }).compile();
        service = module.get<CategoryService>(CategoryService);
        repo = module.get<Repository<Category>>(getRepositoryToken(Category));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            const categories = await service.findAll();
            expect(categories).toEqual(categoryArray);
        });
    });

    describe('findOne', () => {
        it('should return a category by id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(categoryArray[0]);
            const category = await service.findOne(1);
            expect(category).toEqual(categoryArray[0]);
        });
        it('should throw NotFoundException if category not found', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            (repo.create as jest.Mock).mockImplementation((dto) => dto);
            (repo.save as jest.Mock).mockImplementation((category) =>
                Promise.resolve({ id: 1, ...category }),
            );
            const dto = { name: 'Test', description: 'desc', userId: 1 };
            const category = await service.create(dto as any);
            expect(category).toHaveProperty('id');
            expect(category.name).toBe(dto.name);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(categoryArray[0]);
            (repo.save as jest.Mock).mockImplementation((category) =>
                Promise.resolve(category),
            );
            const dto = { name: 'Updated' };
            const category = await service.update(1, dto as any);
            expect(category.name).toBe('Updated');
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(categoryArray[0]);
            (repo.remove as jest.Mock).mockResolvedValue({});
            const result = await service.remove(1);
            expect(result).toHaveProperty('message');
        });
    });
});
