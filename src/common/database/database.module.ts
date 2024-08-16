/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, ModelDefinition } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({

          uri : `mongodb+srv://konnect1795:${configService.get<string>('MONGO_PASSWORD')}@mivant.qtdmfky.mongodb.net/${configService.get<string>('MONGO_DB')}`

        //uri: `mongodb+srv://Mcanderson:${configService.get<string>('MONGO_NEW_PASSWORD')}@mcanderson-lms.nmedh9k.mongodb.net/${configService.get<string>('MONGO_NEW_DB')}`, // Replace with your actual MongoDB URI
        // mongodb+srv://Mcanderson:5tkSKjKp2GqAUFN@mcanderson-lms.nmedh9k.mongodb.net/mcanderson_lms_V1
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}



// useFactory: (configService: ConfigService) => ({
//   uri: configService.get('MONGODB_URI'),
// }),
// inject: [ConfigService],
// }),

// 8MlwsPHCVNEirnDH