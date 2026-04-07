import { AbstractRepository } from '@app/common';
import { UserDocument } from '@app/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
