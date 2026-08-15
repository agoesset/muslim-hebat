import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class ContactDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  subject!: string;

  @IsString()
  @MinLength(10)
  message!: string;
}

export class UpdateContactDto {
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
