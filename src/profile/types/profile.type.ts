import { UserType } from '@app/user/dto/user.type';

export type ProfileType = UserType & { following: boolean };