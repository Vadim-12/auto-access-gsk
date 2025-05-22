import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const existedUser = await this.userRepository.findByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (existedUser) {
      throw new ConflictException(
        `User with phoneNumber ${createUserDto.phoneNumber} already exists`,
      );
    }

    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser({
      ...rest,
      passwordHash,
    });
    return new UserDto(createdUser);
  }

  async hasAnyAdmin(): Promise<boolean> {
    return this.userRepository.hasAnyAdmin();
  }

  async findAll(
    getUserFilterDto: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    const [users, total] = await this.userRepository.findAll(getUserFilterDto);
    return {
      items: users.map((user) => new UserDto(user)),
      total,
    };
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    return user ? new UserDto(user) : null;
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    return new UserDto(user);
  }

  async removeById(id: string): Promise<void> {
    await this.userRepository.removeById(id);
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.userRepository.update(updateUserDto);
    return new UserDto(updatedUser);
  }

  async getUsersByFilter(
    filter: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(filter);
    const dtos = users.map((user) => new UserDto(user));
    return { items: dtos, total };
  }
}
