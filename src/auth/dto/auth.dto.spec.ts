import { validate } from 'class-validator';
import { RegisterDto, LoginDto } from './auth.dto';

describe('AuthDto', () => {
  describe('RegisterDto', () => {
    it('should be valid with valid data', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should be invalid with empty name', async () => {
      const dto = new RegisterDto();
      dto.name = '';
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should be invalid with invalid email', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should be invalid with short password', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'test@example.com';
      dto.password = '12345';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });
  });

  describe('LoginDto', () => {
    it('should be valid with valid data', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should be invalid with invalid email', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should be invalid with empty password', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});
