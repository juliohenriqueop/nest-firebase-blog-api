import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param, Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UsersService, UserError } from '@modules/users';
import { FindUsersInputDto, FindUserOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';
import { FindUsersOutputDto } from '@modules/users';
import { toFindUsersOutputDtoFromListUsersResult } from '@modules/users';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
}
