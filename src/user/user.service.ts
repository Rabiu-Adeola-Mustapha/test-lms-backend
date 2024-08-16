/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import { User } from "./entities/user.entity";
import { MailService } from 'src/common/mail/mail.service';
import { randomBytes } from 'crypto';
import { CourseService } from 'src/course/course.service';
import { EnrolService } from 'src/enrol/enrol.service';
import { Types } from 'mongoose';
import { CreateEnrolmentInput } from './dto/create-enrolment.inputs';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { USERS_IMAGE_FILE_EXTENSION } from './user.constant';
import { FileUpload } from 'graphql-upload-ts';
import { string } from 'joi';
import { UserDocument } from './entities/user.entity';
import { ForgetPasswordInput } from './dto/forget-password.input';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';




const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16; // For AES, this is always 16




@Injectable()
export class UserService {
  
  constructor(private readonly usersRepository: UserRepository,
               private readonly mailService: MailService,
              private readonly courseService : CourseService,
               private readonly enrolService : EnrolService,
               private readonly fileUpload : FileUploadService
                 ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, regOTP } = createUserInput;
    const existingUser = await this.usersRepository.findOne({ email});

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');    
    }

    if ( !regOTP) {
      throw new UnauthorizedException('Incomplete Credentials');
     }

    const otpPlaceholder = "generate_otp";

    
    // check this logic again or re-write
    if(createUserInput.regOTP === otpPlaceholder) {
        const otp = await this._otpGenerate();
        console.log(otp);
        createUserInput.regOTP = otp;

        const mailBody = {
            email : createUserInput.email,
            subject: 'OTP ✔',
            text: `Hello world!, Should send OTP ${otp}`,
            html: `<b>Hello world! , Should send OTP ${otp}</b>`,
        }

        await this.mailService.sendMail(mailBody);
    }
    
    console.log(createUserInput);

    const newUser = await this.usersRepository.create({
      ...createUserInput,
      password: await this.hashPassword(createUserInput.password),
      regOTPConfirmed: false,
    });

    return newUser;
  }
 

 

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, attrs: Partial<User>) {

    const user = await this.findOne(_id);

    if (!user) {
      throw new Error ("User Not Found !")
    }

    if (attrs.password) {
        const newPass = await this.hashPassword(attrs.password);

        attrs.password = newPass;
    }
   

    Object.assign(user, attrs);

    return user.save();
    
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  

  // async updateAvatarGQL(userId, file:FileUpload): Promise<string> {
    
  //     try {

  //       const result = await this.fileUpload.uploadAvatarCloud(file); // Use your Cloudinary service to upload
  //       const avatarUrl = result.secure_url;
  //       await this.usersRepository.findOneAndUpdate(userId, { avatarUrl});
  //       return avatarUrl

  //     } catch (error) {
  //       throw new BadRequestException(`Failed to upload avatar: ${error.message}`);
  //     }
  // }
    

  async updateAvatar(fileBuffer: Buffer, userId: any): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({_id : userId});

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const result = await this.fileUpload.uploadFile(fileBuffer);

      user.avatarUrl = result.secure_url;

      await user.save()
      //this.usersRepository.save(user);
      // Assuming result.secure_url contains the URL of the uploaded file
      return result.secure_url;
      
    } catch (error) {
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }
  }


  async forgetPassword(forgetPasswordInput: ForgetPasswordInput): Promise<{ status: string; message: string }> {

    const { email } = forgetPasswordInput;

    try {
      const user = await this.usersRepository.findOne({ email });

      if (!user) {
         // Log 
        return {
          status : "Failed",
          message: "Check your mail for reset password link if email already signuped "
        } 
        //throw new BadRequestException('User with this email does not exist');
      }
  
      // Use nanoid to generate a secure reset token
    const resetToken = nanoid(64); // 64-character token
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
  
      await user.save();
  
      const resetUrl = `${process.env.FRONTEND_URL}/user/forget-passoword-reset?token=${resetToken}`;
      //const encryptedResetUrl = this.encryptUrl(resetUrl);
  
      const mailBody = {
        email : email,   
        subject: 'Reset Password Request✔',
        text: `Reset Password Request`,
        html: `<p>Click here to reset your password: </p><p><a href="${resetUrl}"> Reset Password </a></p>`,
      }
  
      await this.mailService.sendMail(mailBody);
       
      return {
        status : "Successful",
        message: "Check your mail for reset password link if email already signuped "
      }

    }catch (error) {
      throw new Error(`Failed to forget password: ${error.message}`);
    }
    
  }



  
  async forgetPasswordReset(newPassword: string, resetToken: string) {

     console.log('Received reset token:', resetToken);
      // find reset token

      
       // Trim any extra whitespace
     resetToken = resetToken.trim();

      // Define the expected length based on nanoid usage
      const expectedLength = 64; // Since nanoid(64) is used
  
     // Validate the token's length
      if (typeof resetToken !== 'string' || resetToken.length !== expectedLength) {
       throw new Error('Invalid reset token format');
     }

      const user = await this.usersRepository.findOne({
        resetToken: resetToken,
        resetTokenExpires : {$gte : new Date()}
      });


      if (!user) {
        throw new UnauthorizedException("Invalid Link")
      }
      console.log("new Pass", newPassword  );
      console.log("token",  resetToken)
      // change password to new password and dont forget to hash
      const newHashPassword = await this.hashPassword(newPassword);

      user.password = newHashPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      
      await user.save();

      return {
        status  : "Sucessful",
          msg : "Passoword Updated Successfully"

      }
  }

  async resetPassword(id, oldPassword , newPassword): Promise<void> {


    try {

      const user = await this.usersRepository.findOne(id);

      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      
      // compare old password
      const tokenIsValid = await bcrypt.compare(oldPassword, user.password);
      if (!tokenIsValid) {
        throw new UnauthorizedException('Invalid credentilas');
      }

      
      const newHashPassword = await this.hashPassword(newPassword);
      user.password = newHashPassword;
  
      await user.save();

    }catch (error) { 
      throw new Error(`Failed to send reset password email: ${error.message}`);

    }
   


  }


 

  async uploadPDF(file: Buffer) :Promise<UploadApiResponse> {

    return  this.fileUpload.uploadFile(file);

  }

  async registerACourse(courseId,userId) {

    return await this.enrolService.registerCourse(courseId,userId)

  }



  ////// ##############    Helpers Or Utils Funcs     ###################

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
   
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    if(user.regOTPConfirmed === false) { 
      throw new UnauthorizedException('Please confirm your registration');
    }
    return user;
  }

  private async emailExists(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    else  return false;
  }
   

  private _otpGenerate(): string {
    // Generate 2 random bytes (16 bits) and convert them to a hexadecimal string
    const randomBytesHex = randomBytes(2).toString('hex');
    
    // Convert the hexadecimal string to a decimal number
    const randomNumber = parseInt(randomBytesHex, 16);

    // Calculate the OTP by taking the modulo with 10000 to ensure it's a 4-digit number
    const otp = randomNumber % 10000;

    // Convert the OTP to a string and pad it with leading zeros if necessary
    const paddedOtp = otp.toString().padStart(4, '0');

    console.log(paddedOtp);
    console.log(typeof(paddedOtp));
    
    return paddedOtp;
  }
  
  
  private encryptUrl(url: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(url);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }


  private decryptUrl(encryptedUrl: string): string {
    const textParts = encryptedUrl.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  

  
}