import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(4)
  @MaxLength(72)
  password: string
}
