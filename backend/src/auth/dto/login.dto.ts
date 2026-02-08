import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Veuillez fournir un email valide' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
