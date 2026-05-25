import { IsEmail, IsOptional, IsString } from "class-validator";

export class SubscriberDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
