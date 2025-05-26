import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { SearchUserParams } from './user.types';
import { UserRoleEnum } from '../../consts';
import { GetUserFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser<T extends DeepPartial<UserEntity>>(
    entity: T,
  ): Promise<UserEntity> {
    return this.userRepository.save(entity);
  }

  async findAndCount(
    params: SearchUserParams,
  ): Promise<{ items: UserEntity[]; total: number }> {
    const [items, total] = await this.qb('and', params).getManyAndCount();
    return { items, total };
  }

  async updateUser(params: DeepPartial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await this.userRepository.update(
      { userId: params.userId },
      params,
    );
    return updatedUser.raw[0];
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete({ userId });
  }

  qb(
    specific: 'and' | 'or',
    params: SearchUserParams = {},
    alias = 'user',
  ): SelectQueryBuilder<UserEntity> {
    const query = this.userRepository.createQueryBuilder(alias);

    if (params?.userIds?.length) {
      query[specific + 'Where'](`${alias}.user_id in (:...userIds)`, {
        userIds: params.userIds,
      });
    }

    if (params?.phoneNumbers?.length) {
      query[specific + 'Where'](`${alias}.phoneNumber in (:...phoneNumbers)`, {
        phoneNumbers: params.phoneNumbers,
      });
    }

    // Pagination
    if (params.take) {
      query.take(params.take);
    }
    if (params.skip) {
      query.skip(params.skip);
    }

    return query;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { phoneNumber },
    });
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({
      where: { userId: id },
    });
  }

  async findByRole(role: UserRoleEnum): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { role },
    });
  }

  async findAll(filter: GetUserFilterDto): Promise<[UserEntity[], number]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filter.userIds?.length) {
      queryBuilder.andWhere('user.user_id IN (:...userIds)', {
        userIds: filter.userIds,
      });
    }

    if (filter.phoneNumbers?.length) {
      queryBuilder.andWhere('user.phoneNumber IN (:...phoneNumbers)', {
        phoneNumbers: filter.phoneNumbers,
      });
    }

    if (filter.take) {
      queryBuilder.take(filter.take);
    }

    if (filter.skip) {
      queryBuilder.skip(filter.skip);
    }

    return queryBuilder.getManyAndCount();
  }

  async update(updateUserDto: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this.findById(updateUserDto.userId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async removeById(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async hasAnyAdmin(): Promise<boolean> {
    const admin = await this.userRepository.findOne({
      where: { role: UserRoleEnum.ADMIN },
    });
    return !!admin;
  }
}
