import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const userArray = [
    {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        telephone: '123',
        rol: 'user',
    },
];

const mockUserRepo = () => ({
    find: jest.fn().mockResolvedValue(userArray),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
        .fn()
        .mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    remove: jest.fn().mockResolvedValue({}),
});

describe('UserService', () => {
    let service: UserService;
    let repo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useFactory: mockUserRepo },
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = await service.findAll();
            expect(users).toEqual(userArray);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(userArray[0]);
            const user = await service.findOne(1);
            expect(user).toEqual(userArray[0]);
        });
        it('should throw NotFoundException if user not found', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            (service as any).findByEmail = jest.fn().mockResolvedValue(null);
            (repo.create as jest.Mock).mockImplementation((dto) => dto);
            (repo.save as jest.Mock).mockImplementation((user) =>
                Promise.resolve({ id: 1, ...user }),
            );
            const dto = {
                name: 'Test',
                email: 'test2@example.com',
                password: '123',
                confirmPassword: '123',
                telephone: '123',
                rol: 'user',
            };
            const user = await service.create(dto as any);
            expect(user).toHaveProperty('id');
            expect(user.email).toBe(dto.email);
        });
        it('should throw ConflictException if email exists', async () => {
            (service as any).findByEmail = jest.fn().mockResolvedValue(userArray[0]);
            const dto = {
                name: 'Test',
                email: 'test@example.com',
                password: '123',
                confirmPassword: '123',
                telephone: '123',
                rol: 'user',
            };
            await expect(service.create(dto as any)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(userArray[0]);
            (repo.save as jest.Mock).mockImplementation((user) =>
                Promise.resolve(user),
            );
            const dto = { name: 'Updated' };
            const user = await service.update(1, dto);
            expect(user.name).toBe('Updated');
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            (service as any).findOne = jest.fn().mockResolvedValue(userArray[0]);
            (repo.remove as jest.Mock).mockResolvedValue({});
            const result = await service.remove(1);
            expect(result).toHaveProperty('message');
        });
    });
});
