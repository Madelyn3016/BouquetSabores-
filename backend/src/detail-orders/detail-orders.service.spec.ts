import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DetailOrdersService } from './detail-orders.service';
import { DetailOrders } from '../entities/detailOrders.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const detailArray = [
    { id: 1, suubtotal: 50, cantidad: 2, order: { id: 1 }, product: { id: 1 } },
];

const mockDetailRepo = () => ({
    find: jest.fn().mockResolvedValue(detailArray),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((detail) => Promise.resolve({ id: 1, ...detail })),
    remove: jest.fn().mockResolvedValue({}),
});

describe('DetailOrdersService', () => {
    let service: DetailOrdersService;
    let repo: Repository<DetailOrders>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DetailOrdersService,
                { provide: getRepositoryToken(DetailOrders), useFactory: mockDetailRepo },
            ],
        }).compile();
        service = module.get<DetailOrdersService>(DetailOrdersService);
        repo = module.get<Repository<DetailOrders>>(getRepositoryToken(DetailOrders));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of details', async () => {
            const details = await service.findAll();
            expect(details).toEqual(detailArray);
        });
    });

    describe('findOne', () => {
        it('should return a detail by id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(detailArray[0]);
            const detail = await service.findOne(1);
            expect(detail).toEqual(detailArray[0]);
        });
        it('should throw NotFoundException if detail not found', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new detail', async () => {
            (repo.create as jest.Mock).mockImplementation((dto) => dto);
            (repo.save as jest.Mock).mockImplementation((detail) => Promise.resolve({ id: 1, ...detail }));
            const dto = { suubtotal: 50, cantidad: 2, orderId: 1, productId: 1 };
            const detail = await service.create(dto as any);
            expect(detail).toHaveProperty('id');
            expect(detail.suubtotal).toBe(dto.suubtotal);
        });
    });

    describe('update', () => {
        it('should update a detail', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(detailArray[0]);
            (repo.save as jest.Mock).mockImplementation((detail) => Promise.resolve(detail));
            const dto = { suubtotal: 100 };
            const detail = await service.update(1, dto as any);
            expect(detail.suubtotal).toBe(100);
        });
    });

    describe('remove', () => {
        it('should remove a detail', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(detailArray[0]);
            (repo.remove as jest.Mock).mockResolvedValue({});
            const result = await service.remove(1);
            expect(result).toHaveProperty('message');
        });
    });
});
