/* eslint-disable prettier/prettier */
export interface TokenPayload {
  _id: string;
  email: string;
  userName: string;
  firstName? : String;
  lastName? : String;
  phone? : String;
  gender? : String;
  address? : String;
  city? : String;
  state? : String;
}