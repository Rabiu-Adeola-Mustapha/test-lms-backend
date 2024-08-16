/* eslint-disable prettier/prettier */
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from '../stripe/stripe.service'; 
import { EnrolService } from 'src/enrol/enrol.service'; 
import Stripe from 'stripe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('webhooks')
@UseGuards(JwtAuthGuard)
export class WebhooksController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly enrolService: EnrolService,
  ) {}

  @Post('stripe')
  //@UseGuards(JwtAuthGuard)
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
          // Enroll the user in the course
          const userId = paymentIntent.metadata.userId;
          const courseId = paymentIntent.metadata.courseId;
  
          try {
            await this.enrolService.registerCourse(courseId, userId);
            res.status(200).json({ received: true });
          } catch (err) {
            console.error(`Failed to register course: ${err.message}`);
            res.status(500).send(`Failed to register course: ${err.message}`);
          }
          break;
        }
  
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
          // Handle the payment failure
          const userId = paymentIntent.metadata.userId;
          const courseId = paymentIntent.metadata.courseId;
  
          console.error(`Payment failed for user ${userId} for course ${courseId}`);
          // Optionally, implement logic to notify the user about the failure or take other actions
          res.status(200).json({ received: true });
          break;
        }
  
        default:
          console.log(`Unhandled event type ${event.type}`);
          res.status(400).send(`Unhandled event type ${event.type}`);
          break;
      }
   }
}
