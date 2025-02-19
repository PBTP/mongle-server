import {
  AllExceptionFilter,
  BadRequestExceptionFilter,
  EntityNotFoundExceptionFilter,
  ForbiddenExceptionFilter,
  HttpExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
} from '../../src/common/filters/exception.filters';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

describe('ExceptionFilter 테스트', () => {
  describe('AllExceptionFilter 테스트', () => {
    let filter: AllExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [AllExceptionFilter],
      }).compile();

      filter = module.get<AllExceptionFilter>(AllExceptionFilter);
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('정의된 ExceptionFilter를 제외한 나머지 Exception에 대해선 AllExceptionFilter가 위임받는다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new HttpException(
        'BAD_GATEWAY',
        HttpStatus.BAD_GATEWAY,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_GATEWAY,
        data: null,
        message: '오류가 발생했습니다.',
      });
    });
  });

  describe('HttpExceptionFilter 테스트', () => {
    let filter: HttpExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [HttpExceptionFilter],
      }).compile();

      filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('정의된 ExceptionFilter를 제외한 나머지 Exception에 대해선 HttpExceptionFilter가 위임받는다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new HttpException('Conflict', HttpStatus.CONFLICT);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CONFLICT,
        data: null,
        message: 'Conflict',
      });
    });
  });

  describe('ForbiddenExceptionFilter 테스트', () => {
    let filter: ForbiddenExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [ForbiddenExceptionFilter],
      }).compile();

      filter = module.get<ForbiddenExceptionFilter>(ForbiddenExceptionFilter);
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('ForbiddenException을 처리하고 지정한 Response 포멧으로 리턴해야한다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new ForbiddenException();

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        data: null,
        message: '권한이 없습니다.',
      });
    });
  });

  describe('UnauthorizedExceptionFilter 테스트', () => {
    let filter: UnauthorizedExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UnauthorizedExceptionFilter],
      }).compile();

      filter = module.get<UnauthorizedExceptionFilter>(
        UnauthorizedExceptionFilter,
      );
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('UnauthorizedException을 처리하고 지정한 Response 포멧으로 리턴해야한다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new UnauthorizedException();

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: null,
        message: '로그인이 필요합니다.',
      });
    });
  });

  describe('BadRequestExceptionFilter 테스트', () => {
    let filter: BadRequestExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [BadRequestExceptionFilter],
      }).compile();

      filter = module.get<BadRequestExceptionFilter>(BadRequestExceptionFilter);
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('BadRequestException을 처리하고 지정한 Response 포멧으로 리턴해야한다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new BadRequestException();

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        data: null,
        message: '요청이 잘못되었습니다.',
        secretMessage: 'Bad Request',
      });
    });
  });

  describe('NotFoundExceptionFilter 테스트', () => {
    let filter: NotFoundExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [NotFoundExceptionFilter],
      }).compile();

      filter = module.get<NotFoundExceptionFilter>(NotFoundExceptionFilter);
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('NotFoundException을 처리하고 지정한 Response 포멧으로 리턴해야한다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new NotFoundException();

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        data: null,
        message: '찾을 수 없습니다.',
      });
    });
  });

  describe('EntityNotFoundExceptionFilter 테스트', () => {
    let filter: EntityNotFoundExceptionFilter;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [EntityNotFoundExceptionFilter],
      }).compile();

      filter = module.get<EntityNotFoundExceptionFilter>(
        EntityNotFoundExceptionFilter,
      );
    });

    test('should be defined', () => {
      expect(filter).toBeDefined();
    });

    test('EntityNotFoundException을 처리하고 지정한 Response 포멧으로 리턴해야한다.', () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRequest = {
        url: '/test-url',
      } as Request;

      const mockHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as unknown as ArgumentsHost;

      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        data: null,
        message: '찾을 수 없습니다.',
      });
    });
  });
});
