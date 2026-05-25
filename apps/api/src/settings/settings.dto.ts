import { IsObject, IsString, MinLength } from "class-validator";

export class SiteSettingDto {
  @IsString()
  @MinLength(2)
  key!: string;

  @IsObject()
  value!: Record<string, unknown>;
}
