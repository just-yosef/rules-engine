import { Body, Controller, Get, Param, Patch, } from '@nestjs/common';
import { UsersService } from "./users.service"
import { UpdateUserDto } from './dtos';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }
    @Get()
    async getAllUsers() {
        return this.usersService.findAll()
    }
    @Get('/:id')
    async getUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    @Patch("/:id")
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, dto);
    }
}