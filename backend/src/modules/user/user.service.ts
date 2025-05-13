import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'node:crypto';
import { UserRepository } from './user.repository';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const userExist = await this.userRepository.findByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (userExist) {
      throw new ConflictException('User already exist');
    }
    const verificationCode = crypto.randomBytes(6).toString('hex');
    await this.userRepository.createUser({
      verificationCode,
      ...createUserDto,
    });
  }

  async findAll(
    getUserFilterDto: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(getUserFilterDto);
    const dtos = users.map((user) => new UserDto(user));
    return { items: dtos, total };
  }

  async update(updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUser(updateUserDto);
    return new UserDto(updatedUser);
  }

  async removeById(userId: string) {
    await this.userRepository.deleteUser(userId);
  }

  // async verifyCode({
  //   phoneNumber,
  //   verificationCode,
  // }: VerifyCodeDto): Promise<boolean> {
  //   const user = await this.userRepository.findByPhoneNumber(phoneNumber);
  //   if (!user) {
  //     throw new NotFoundException(
  //       `User with phone number ${phoneNumber} not found`,
  //     );
  //   }
  //   return user.verificationCode === verificationCode;
  // }

  async getUsersByFilter(
    filter: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(filter);
    const dtos = users.map((user) => new UserDto(user));
    return { items: dtos, total };
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException(
        `User with phone number ${phoneNumber} not found`,
      );
    }
    return new UserDto(user);
  }

  async findById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return new UserDto(user);
  }
}
