import { Test, TestingModule } from '@nestjs/testing';
import { DetailOrdersController } from './detail-orders.controller';
import { DetailOrdersService } from './detail-orders.service';
import { CreateDetailOrderDto } from './dto/createDetail-order.dto';
import { UpdateDetailOrderDto } from './dto/updateDetail-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('DetailOrdersController', () => {
    let controller: DetailOrdersController;
    let service: DetailOrdersService;

    const detailEntity = { id: 1, suubtotal: 50, cantidad: 2, product: { id: 1 }, order: { id: 1 } };
    const serviceMock = {
        create: jest.fn().mockResolvedValue(detailEntity),
        findAll: jest.fn().mockResolvedValue([detailEntity]),
        findOne: jest.fn().mockResolvedValue(detailEntity),
        update: jest.fn().mockResolvedValue({ ...detailEntity, suubtotal: 75 }),
        remove: jest.fn().mockResolvedValue({ message: 'Detalle eliminado' }),
    } as unknown as DetailOrdersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DetailOrdersController],
            providers: [
                { provide: DetailOrdersService, useValue: serviceMock },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<DetailOrdersController>(DetailOrdersController);
        service = module.get<DetailOrdersService>(DetailOrdersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should return detail', async () => {
        const dto: CreateDetailOrderDto = { suubtotal: 50, cantidad: 2, productId: 1, orderId: 1 };
        const result = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(detailEntity);
    });

    it('findAll should return list', async () => {
        const result = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([detailEntity]);
    });

    it('findOne should return detail', async () => {
        const result = await controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(detailEntity);
    });

    it('update should change subtotal', async () => {
        const dto: UpdateDetailOrderDto = { suubtotal: 75 } as any;
        const result = await controller.update(1, dto);
        expect(service.update).toHaveBeenCalledWith(1, dto);
        expect(result.suubtotal).toBe(75);
    });

    it('remove should return message', async () => {
        const result = await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: 'Detalle eliminado' });
    });
});