import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Orders } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const orderArray = [
    { id: 1, name_client: 'Cliente', total: 100, telephone: '123', state: 'pendiente', address: 'Calle', method_pay: 'efectivo', date: new Date(), detailOrders: [] },
];

const mockOrdersRepo = () => ({
    find: jest.fn().mockResolvedValue(orderArray),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((order) => Promise.resolve({ id: 1, ...order })),
    remove: jest.fn().mockResolvedValue({}),
});

describe('OrdersService', () => {
    let service: OrdersService;
    let repo: Repository<Orders>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                { provide: getRepositoryToken(Orders), useFactory: mockOrdersRepo },
            ],
        }).compile();
        service = module.get<OrdersService>(OrdersService);
        repo = module.get<Repository<Orders>>(getRepositoryToken(Orders));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of orders', async () => {
            const orders = await service.findAll();
            expect(orders).toEqual(orderArray);
        });
    });

    describe('findOne', () => {
        it('should return an order by id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(orderArray[0]);
            const order = await service.findOne(1);
            expect(order).toEqual(orderArray[0]);
        });
        it('should throw NotFoundException if order not found', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new order', async () => {
            (repo.create as jest.Mock).mockImplementation((dto) => dto);
            (repo.save as jest.Mock).mockImplementation((order) => Promise.resolve({ id: 1, ...order }));
            const dto = { name_client: 'Cliente', total: 100, telephone: '123', state: 'pendiente', address: 'Calle', method_pay: 'efectivo', date: new Date() };
            const order = await service.create(dto as any);
            expect(order).toHaveProperty('id');
            expect(order.name_client).toBe(dto.name_client);
        });
    });

    describe('update', () => {
        it('should update an order', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(orderArray[0]);
            (repo.save as jest.Mock).mockImplementation((order) => Promise.resolve(order));
            const dto = { name_client: 'Actualizado' };
            const order = await service.update(1, dto as any);
            expect(order.name_client).toBe('Actualizado');
        });
    });

    describe('remove', () => {
        it('should remove an order', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(orderArray[0]);
            (repo.remove as jest.Mock).mockResolvedValue({});
            const result = await service.remove(1);
            expect(result).toHaveProperty('message');
        });
    });
});
