/* eslint-disable prettier/prettier */
interface CartItem {
    //courseId: string;
    course_title: string;
    price:  number;
    quantity?: number;
    description?: string;
    _id: string;
   // __v: number;
  }
  
  export type Cart = CartItem[];