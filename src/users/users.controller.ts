import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UsersService, UserError } from '@modules/users';
import { FindUserOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';

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
}
