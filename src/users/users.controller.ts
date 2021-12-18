import { Controller } from '@nestjs/common';
import { Post, Get, Patch, Delete } from '@nestjs/common';
import { Param, Query, Body } from '@nestjs/common';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService, UserError } from '@modules/users';
import { CreateUserInputDto, CreateUserOutputDto } from '@modules/users';
import { toCreateRequestFromCreateUserInputDto } from '@modules/users';
import { toCreateUserOutputDtoFromUserRecord } from '@modules/users';
import { FindUserOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';
import { FindUsersInputDto, FindUsersOutputDto } from '@modules/users';
import { toFindUsersOutputDtoFromListUsersResult } from '@modules/users';
import { UpdateUserInputDto, UpdateUserOutputDto } from '@modules/users';
import { toUpdateRequestFromUpdateUserInputDto } from '@modules/users';
import { toUpdateUserOutputDtoFromUserRecord } from '@modules/users';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(
    @Body() properties: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    try {
      const createRequest = toCreateRequestFromCreateUserInputDto(properties);
      const user = await this.userService.create(createRequest);

      return toCreateUserOutputDtoFromUserRecord(user);
    } catch (userException) {
      if (userException.type === UserError.EMAIL_ALREADY_USED) {
        throw new ConflictException(userException.message);
      }

      if (userException.type === UserError.PHONE_NUMBER_ALREADY_USED) {
        throw new ConflictException(userException.message);
      }

      throw userException;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<FindUserOutputDto> {
    try {
      const user = await this.userService.findById(id);
      return toFindUserOutputDtoFromUserRecord(user);
    } catch (findByIdException) {
      if (findByIdException.type === UserError.NOT_FOUND) {
        throw new NotFoundException(findByIdException.message);
      }

      throw findByIdException;
    }
  }

  @Get()
  async find(@Query() findBy: FindUsersInputDto): Promise<FindUsersOutputDto> {
    try {
      const response: FindUsersOutputDto = {
        nextPage: '',
        users: [],
      };

      if (findBy.email) {
        const user = await this.userService.findByEmail(findBy.email);
        response.users.push(toFindUserOutputDtoFromUserRecord(user));

        return response;
      }

      if (findBy.phoneNumber) {
        const user = await this.userService.findByPhoneNumber(
          findBy.phoneNumber,
        );

        response.users.push(toFindUserOutputDtoFromUserRecord(user));

        return response;
      }

      const pageToken = findBy.page?.length > 0 ? findBy.page : undefined;
      const listUsersResult = await this.userService.findAll(pageToken);

      return toFindUsersOutputDtoFromListUsersResult(listUsersResult);
    } catch (findOneException) {
      if (findOneException.type === UserError.NOT_FOUND) {
        throw new NotFoundException(findOneException.message);
      }

      throw findOneException;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() properties: UpdateUserInputDto,
  ): Promise<UpdateUserOutputDto> {
    try {
      const updateRequest = toUpdateRequestFromUpdateUserInputDto(properties);
      const user = await this.userService.update(id, updateRequest);

      return toUpdateUserOutputDtoFromUserRecord(user);
    } catch (userException) {
      if (userException.type === UserError.NOT_FOUND) {
        throw new NotFoundException(userException.message);
      }

      if (userException.type === UserError.EMAIL_ALREADY_USED) {
        throw new ConflictException(userException.message);
      }

      if (userException.type === UserError.PHONE_NUMBER_ALREADY_USED) {
        throw new ConflictException(userException.message);
      }

      throw userException;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.userService.delete(id);
    } catch (userException) {
      if (userException.type === UserError.NOT_FOUND) {
        throw new NotFoundException(userException.message);
      }

      throw userException;
    }
  }
}
