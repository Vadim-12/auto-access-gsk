import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { CheckExistUserParams, SearchUserParams } from './user.types';

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

  async findById(userId: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ userId });
  }

  async findAndCount(
    params: SearchUserParams,
  ): Promise<{ items: UserEntity[]; total: number }> {
    const [items, total] = await this.qb(params).getManyAndCount();
    return { items, total };
  }

  async updateUser(params: DeepPartial<UserEntity>): Promise<void> {
    await this.userRepository.update({ userId: params.userId }, params);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }

  async checkExistUser(
    params: CheckExistUserParams,
    alias = 'user',
  ): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder(alias);

    query.where('user.phoneNumber = :phoneNumber', {
      phoneNumber: params.phoneNumber,
    });

    const result = await query.getOne();
    return result ? true : false;
  }

  qb(
    params: SearchUserParams = {},
    alias = 'user',
  ): SelectQueryBuilder<UserEntity> {
    const query = this.userRepository.createQueryBuilder(alias);

    if (params?.userIds?.length) {
      query.andWhere(`${alias}.userId in (:...userIds)`, {
        userIds: params.userIds,
      });
    }

    if (params?.phoneNumbers?.length) {
      query.andWhere(`${alias}.phoneNumber in (:...phoneNumbers)`, {
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

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ phoneNumber: phoneNumber });
  }
}
