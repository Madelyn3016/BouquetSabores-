import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    const orderEntity = { id: 1, name_client: 'Client', telephone: '123', total: 100, state: 'PENDIENTE', address: 'Calle', method_pay: 'EFECTIVO', date: new Date() };
    const serviceMock = {
        create: jest.fn().mockResolvedValue(orderEntity),
        findAll: jest.fn().mockResolvedValue([orderEntity]),
        findOne: jest.fn().mockResolvedValue(orderEntity),
        update: jest.fn().mockResolvedValue({ ...orderEntity, state: 'ENTREGADO' }),
        remove: jest.fn().mockResolvedValue({ message: 'Orden eliminada' }),
    } as unknown as OrdersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                { provide: OrdersService, useValue: serviceMock },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should return order', async () => {
        const dto: CreateOrderDto = { name_client: 'Client', telephone: '123', total: 100, state: 'PENDIENTE', address: 'Calle', method_pay: 'EFECTIVO', date: new Date().toISOString() };
        const result = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(orderEntity);
    });

    it('findAll should return list', async () => {
        const result = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([orderEntity]);
    });

    it('findOne should return order', async () => {
        const result = await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(orderEntity);
    });

    it('update should change state', async () => {
        const dto: UpdateOrderDto = { state: 'ENTREGADO' } as any;
        const result = await controller.update(1, dto);
        expect(service.update).toHaveBeenCalledWith(1, dto);
        expect(result.state).toBe('ENTREGADO');
    });

    it('remove should return message', async () => {
        const result = await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: 'Orden eliminada' });
    });
});