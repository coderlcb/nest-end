import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import mongoose from 'mongoose';
@Injectable()
export class UserService {
  //注册Schama后通过@InjectModel将User模型注入到UserService中
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  //创建用户
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = {
      username: createUserDto.username,
      password: createUserDto.password
    };
    const createUser = new this.userModel(user);
    const temp = await createUser.save();
    return temp;
  }
  // 查找
  async findAll(): Promise<{ num: number }> {
    const temp = await this.userModel.find().exec();
    return {
      num: temp.length
    };
  }
  // 通过ID查找用户
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $project: {
          password: 0
        }
      }
    ]);
    return user[0];
  }
  // 通过ID查找用户,返回指定字段
  async findOneByUsername(username: string): Promise<User> {
    const [user] = await this.userModel.find({ username: username });
    return user;
  }
  // 删除
  async delete(id: number) {
    const temp = await this.userModel.remove({ _id: id });
    return temp;
  }
  // 修改
  async updateUser(id: number, data: any) {
    const temp = await this.userModel.updateOne({ _id: id }, { $set: data });
    return temp;
  }
}
