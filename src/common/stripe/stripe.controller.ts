/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, Param } from '@nestjs/common';

import { StripeService } from './stripe.service';

import { Cart } from './cart.model'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';

@Controller('stripe')
@UseGuards(JwtAuthGuard)
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-payment-intent/:courseId')
  @UseGuards(JwtAuthGuard)
  checkout(
    @Param('courseId') courseId: string,
    @Body() body: { cart: Cart },
    @CurrentUser() user: TokenPayload,
  ) {
    try {
      return this.stripeService.checkout(body.cart, user._id, courseId);
    } catch (error) {
      return error;
    }
  }
}