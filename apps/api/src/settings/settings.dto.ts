import { IsObject, IsOptional, IsString } from "class-validator";

export class SiteSettingDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsObject()
  value!: Record<string, unknown>;
}
