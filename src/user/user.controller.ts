/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, FileTypeValidator, Get, InternalServerErrorException, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Log } from 'src/common/decorators/log.decorator';
import { MyLoggerService } from 'src/common/my-logger/my-logger.service';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { PasswordInput } from './dto/password.input';
//import { Token } from 'graphql';

@Controller('user')
export class UserController {
     
    private readonly context = 'UserController';
    
    constructor(
        private readonly usersService: UserService,
        private readonly logger: MyLoggerService,

    ) {}
    

    // Create A User
    @Post('register')
    async createUser(
      @Body() createUserInput  : CreateUserInput
    ) :Promise<User> {
       return this.usersService.create(createUserInput);
    }


    // Getting All Users
    @Get('users')
    @Log()
    @UseGuards(JwtAuthGuard) 
    async getAllUsers() :Promise<User[]> {

      this.logger.log('Handling GET All request', this.context);

      try {
  
       return await this.usersService.findAll();    
  
      } catch (error) {
  
        this.logger.error(`Error in POST /auth: ${error.message}`, error.stack, this.context);
  
        throw new InternalServerErrorException(error.message);
      }
        
    } 

    // Get A Single User
    @Get('user/:id')
    @UseGuards(JwtAuthGuard)
    async getUser(
      @Param('id') id: string,
      @CurrentUser() token: TokenPayload
      ) :Promise<User> {

      this.logger.log('Handling GET Single request', this.context);
      const loginUserId = token._id

      try {
  
       return await this.usersService.findOne(loginUserId);   
  
      } catch (error) {
  
        this.logger.error(`Error in POST /course: ${error.message}`, error.stack, this.context);
  
        throw new InternalServerErrorException(error.message);
      }
      
    }


    // Update A User
    @Patch('update')
    @UseGuards(JwtAuthGuard)
    async updateUser(
      //@Param('id') id: string,
      @Body() updateUserInput : UpdateUserInput,
      @CurrentUser() token: TokenPayload
    ) : Promise<User> {

      this.logger.log('Handling Post forget-password posting email', this.context);

      const loginUserId = token._id

       try {

         return this.usersService.update(loginUserId, updateUserInput);

       }
       catch(error){

         this.logger.error(`Error in POST /forget-password: ${error.message}`, error.stack, this.context);

       }
    }   

    // Delete A User
    @Post('delete/:id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
    
    // Upload Avatar
    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000000 }),
            new FileTypeValidator({ fileType: /jpeg|pdf|jpg|png/ }),
          ],
        }),
      )
        file: Express.Multer.File,
        @CurrentUser() user: TokenPayload,
    ) {
          console.log("User ID", user._id)
          console.log("Got Here.....", user)

        // if (!file) {
        //     throw new BadRequestException('File is required');
        // }

        try {

          const result = await this.usersService.updateAvatar(file.buffer, user._id);

            
          return {
              message: 'File uploaded successfully',
              url: result,
          };

        

            
        } catch (error) {
            throw new BadRequestException(`File upload failed: ${error.message}`);
        }

    
    }



    @Post('forget-password')
    @Log()
    async forgetPassword(
      @Body() forgetPasswordInput: ForgetPasswordInput
       ): Promise<any> {

          this.logger.log('Handling Patch forget-password-Reset posting password after clicking the reset password sent to mail', this.context);

          try {

            return  await this.usersService.forgetPassword(forgetPasswordInput);

          }
          catch (error) {

            this.logger.error(`Error in POST /forget-password: ${error.message}`, error.stack, this.context);
            throw new BadRequestException(`Forget Password: ${error.message}`);

          }
        }


    // This method is called after user clicks on the link sent in forget-password email.
    @Patch('forget-passoword-reset')
    @Log()
    async forgetPasswordReset(
          @Query('token') token: string,
          @Body() passwordInput : PasswordInput
        ){
          // You can implement your own logic here to validate the token and reset the password.
          this.logger.log('Handling Post forget-password posting email', this.context);
          const {newPassword} =  passwordInput
          console.log("new pass", newPassword)


          try {

          return  await this.usersService.forgetPasswordReset(newPassword, token);

          }
          catch (error) {

            this.logger.error(`Error in POST /forget-password: ${error.message}`, error.stack, this.context);
            throw new BadRequestException(`Forget Password Reset: ${error.message}`);

          }
    }
  
    @Patch('reset-password')
    @UseGuards(JwtAuthGuard)
    async resetPassword(
      @Body() resetPasswordInput: ResetPasswordInput,
      @CurrentUser() token : TokenPayload
    ): Promise<void> {

      this.logger.log('Handling Put reset-password posting email and new-password', this.context);

      const loginUserId = token._id;
      const {oldPassword, newPassword} = resetPasswordInput;

      try {

        return this.usersService.resetPassword(loginUserId, oldPassword, newPassword);

      }
      catch (error) {

        this.logger.error(`Error in POST new-password /reset-password: ${error.message}`, error.stack, this.context);
        throw new BadRequestException(`Logged in user trying to reset password: ${error.message}`);


      }

    }
 }
