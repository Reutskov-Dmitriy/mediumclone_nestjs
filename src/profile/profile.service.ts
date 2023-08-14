import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) { }
  async findUserProfile(currentUserId: number, profileUserName: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        name: profileUserName
      },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      }
    })
    console.log('currentuser', currentUserId)
    console.log('user', user)

    console.log('follow', follow)
    return { ...user, following: Boolean(follow) };
  }

  async followProfile(currentUserId: number, profileUserName: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        name: profileUserName,
      }
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId == user.id) {
      throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST)
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      }
    });

    if (!follow) {
      const followNew = new FollowEntity()
      followNew.followerId = currentUserId;
      followNew.followingId = user.id;
      await this.followRepository.save(followNew)
    }

    return { ...user, following: true };

  }

  async unfollowProfile(
    currentUserId: number, profileUserName: string
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        name: profileUserName,
      }
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }
    if (currentUserId == user.id) {
      throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST)
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id
    });

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
