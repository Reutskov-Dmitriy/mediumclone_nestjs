import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService
  ) { }

  @Get(':username')
  @UseGuards(AuthGuard)
  async findUserProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.findUserProfile(
      currentUserId,
      profileUserName)
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      profileUserName
    )
    return this.profileService.buildProfileResponse(profile);
  }
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(
      currentUserId,
      profileUserName
    )
    return this.profileService.buildProfileResponse(profile);
  }
}
