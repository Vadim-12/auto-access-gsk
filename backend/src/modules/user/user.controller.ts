import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoleEnum } from '../../consts';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({
      ...createUserDto,
      role: UserRoleEnum.ADMIN,
    });
  }

  @Post('first-admin')
  createFirstAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({
      ...createUserDto,
      role: UserRoleEnum.ADMIN,
    });
  }

  @Get()
  findAll(
    @Query() getUserFilterDto: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    return this.userService.findAll(getUserFilterDto);
  }

  @Get('has-admin')
  @ApiOperation({ summary: 'Check if any admin exists' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether any admin exists',
    schema: {
      type: 'object',
      properties: {
        hasAdmin: {
          type: 'boolean',
        },
      },
    },
  })
  async hasAdmin() {
    const hasAdmin = await this.userService.hasAnyAdmin();
    return { hasAdmin };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeById(id);
  }
}
