/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req, Res,Param, UseGuards, Query, Get } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { EnrolService } from 'src/enrol/enrol.service'; 
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { MyLoggerService } from '../my-logger/my-logger.service';

@Controller('paystack')
export class PaymentController {
  private readonly context = 'PaystackController';

  constructor(
    private readonly paystackService: PaystackService,
    private readonly enrolService: EnrolService,
    private readonly logger: MyLoggerService,  // Inject MyLoggerService

  ) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  async initializePayment(
   // @Param('courseId') courseId: string,
    @Body() body: { email: string; amount: number; courseId: string },
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,

  ) {

    this.logger.log('Handling payment initialization request', this.context);

    const { email, amount, courseId } = body;
    const userId = user._id.toString();

    const callbackUrl = `${process.env.BASE_URL}/paystack/verify/${userId}/${courseId}`;

   
    
      try {
        const paymentResponse = await this.paystackService.initializePayment(email, Number(amount), callbackUrl);
        return res.status(200).json(paymentResponse);
      } catch (error) {
        this.logger.error(`Error in Post /paystack/initiase: ${error.message}`, error.stack, this.context);
        console.error('Payment initialization failed:', error.message);
        return res.status(400).json({ message: error.message });
      }
  }

  @Post('verify/:userId/:courseId')
  async verifyPayment(
     @Param('userId') userId: string,  // replace with user id from token payload in real implementation
     @Param('courseId') courseId: string,
     @Query('trxref') trxref: string,
     //@Query('reference') reference: string, 
     @Body() body: { reference: string },
      @Res() res: Response,
     //@CurrentUser() user: TokenPayload,

    ) {

    this.logger.log('Handling payment initialization request', this.context);

    const { reference } = body;

    try {

        const verificationResponse = await this.paystackService.verifyPayment(reference);

        // if(user._id.toString() === userId) {

        //     return res.status(400).json({ message: 'UnAuthorised user, verification failed' });
        // }

        if (verificationResponse.data.status === 'success') {
          await this.enrolService.registerCourse(courseId, userId);
          return res.status(200).json({ message: 'Payment verified and course enrolled successfully' });
        }
    
        return res.status(400).json({ message: 'Payment verification failed' });

    }  catch (error) {

      this.logger.error(`Error in Post /paystack/initiase: ${error.message}`, error.stack, this.context);
        console.error('Payment verification failed:', error.message);
        return res.status(400).json({ message: error.message });
      }  
   
  }
}
