import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service.';
import { CreateUserDto, CreateUserRequestDto } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict when register user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success registered new user.' })
  async create(@Body() data: CreateUserRequestDto): Promise<CreateUserDto> {
    return await this.authService.create(data)
  }
}
