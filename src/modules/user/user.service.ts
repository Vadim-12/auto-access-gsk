import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'node:crypto';
import { UserRepository } from './user.repository';
import GetUserFilterDto from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: SignUpDto): Promise<void> {
    const userExist = await this.userRepository.checkExistUser({
      phoneNumber: createUserDto.phoneNumber,
    });

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

  findOne(id: string) {
    return this.userRepository.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser({ userId: id, ...updateUserDto });
  }

  async removeById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.deleteUser(id);
  }

  async verifyCode({
    phoneNumber,
    verificationCode,
  }: SignInDto): Promise<boolean> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException(
        `User with phone number ${phoneNumber} not found`,
      );
    }
    return user.verificationCode === verificationCode;
  }

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
    return user;
  }
}
