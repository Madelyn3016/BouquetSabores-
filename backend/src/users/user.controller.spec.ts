import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const userEntity = { id: 1, name: 'Test', telephone: '123', email: 'test@example.com', password: 'hashed', rol: 'user' };
    const serviceMock = {
        create: jest.fn().mockResolvedValue(userEntity),
        findAll: jest.fn().mockResolvedValue([userEntity]),
        findByEmail: jest.fn().mockResolvedValue(userEntity),
        findOne: jest.fn().mockResolvedValue(userEntity),
        update: jest.fn().mockResolvedValue({ ...userEntity, name: 'Updated' }),
        remove: jest.fn().mockResolvedValue({ message: 'Usuario eliminado' }),
    } as unknown as UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: serviceMock },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should return created user (with hashed password)', async () => {
        const dto: CreateUserDto = {
            name: 'Test', telephone: '123', email: 'test@example.com', password: '123456', confirmPassword: '123456', rol: 'user'
        };
        const result = await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result).toHaveProperty('password');
        expect(result.password).not.toBe(dto.password);
        expect(result).toMatchObject({
            name: 'Test',
            telephone: '123',
            email: 'test@example.com',
            rol: 'user'
        });
    });

    it('findAll should return users without password', async () => {
        const result = await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
        expect(result[0]).not.toHaveProperty('password');
    });

    it('findByEmail should return user without password', async () => {
        const result = await controller.findByEmail('test@example.com');
        expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
        if ('message' in result) {
            fail('Expected a user, got error message');
        }
        expect(result).not.toHaveProperty('password');
    });

    it('findOne should return user without password', async () => {
        const result = await controller.findOne(1);
        if ('message' in result) {
            fail('Expected a user, got error message');
        }
        expect(result).not.toHaveProperty('password');
    });

    it('update should return updated user without password', async () => {
        const dto: UpdateUserDto = { name: 'Updated' } as any;
        const result = await controller.update(1, dto);
        expect(service.update).toHaveBeenCalledWith(1, dto);
        expect(result.name).toBe('Updated');
        expect(result).not.toHaveProperty('password');
    });

    it('remove should return message', async () => {
        const result = await controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: 'Usuario eliminado' });
    });
});