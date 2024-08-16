/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Cart } from './cart.model';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async checkout(cart: Cart, userId: string, courseId: string) {
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    return this.stripe.paymentIntents.create({
      amount: +totalPrice.toFixed(2) * 100, // cents
      currency: 'usd', // set currency
      payment_method_types: ['card'],
      metadata: {
        userId ,
        courseId,
      },
    });
  }

  constructEvent(payload: any, sig: string, endpointSecret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }
}
