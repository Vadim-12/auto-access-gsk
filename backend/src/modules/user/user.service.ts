import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const existedUser = await this.userRepository.findByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (existedUser) {
      throw new ConflictException(
        `User with phoneNumber ${createUserDto.phoneNumber} already exists`,
      );
    }
    await this.userRepository.createUser(createUserDto);
  }

  async findAll(
    getUserFilterDto: GetUserFilterDto,
  ): Promise<{ items: UserDto[]; total: number }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(getUserFilterDto);
    const dtos = users.map((user) => new UserDto(user));
    return { items: dtos, total };
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    return new UserDto(user);
  }

  async findById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return new UserDto(user);
  }

  async removeById(userId: string) {
    await this.userRepository.deleteUser(userId);
  }

  async update(updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUser(updateUserDto);
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
