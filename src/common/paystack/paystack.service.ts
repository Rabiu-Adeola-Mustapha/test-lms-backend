/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly paystackSecretKey: string;

  constructor() {
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  }

  async initializePayment(
    email: string,
    amount: number,
    callbackUrl: string,
  ): Promise<any> {

    const url = 'https://api.paystack.co/transaction/initialize';
    const parsedAmount = Math.round(Number(amount) * 100); // Convert to kobo and ensure no decimals

    const data = {
        email,
        amount: parsedAmount,// convert to kobo
        callback_url: callbackUrl,
    }

    try{


        const response = await axios.post( url, data,
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
    
        return response.data;
    } catch (error) {
        
            throw new Error('Payment initialization failed');
          }
  }

  async verifyPayment(reference: string): Promise<any> {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;

    try{
        const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${this.paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
          });
          return response.data;
    }
    catch (error) {
            console.error('Paystack Verification Error:', error.response?.data || error.message);
            throw new Error('Payment verification failed');
        }

    
  }
}
