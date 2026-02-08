import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return authentication result', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = {
        access_token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          role: UserRole.PARTICIPANT,
        },
      };

      authService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('checkAdmin', () => {
    it('should return welcome message for admin', () => {
      const req = {
        user: {
          id: '1',
          email: 'admin@example.com',
          role: UserRole.ADMIN,
        },
      };

      const result = controller.checkAdmin(req);

      expect(result).toEqual({
        message: 'Bienvenue Admin',
        user: req.user,
      });
    });
  });
});
