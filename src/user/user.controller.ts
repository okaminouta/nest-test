import { Controller, Get, Post, UsePipes, Body, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.gaurd';

@Controller()
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get('admin/users')
  @UseGuards(new AuthGuard())
  showAllUsers() {
    // TODO check for admin role
    return this.userSerice.showAll();
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userSerice.login(data);
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userSerice.register(data);
  }
}
