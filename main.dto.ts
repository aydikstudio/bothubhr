import {IsEmail, MinLength, IsString} from 'class-validator'


export class AuthDto {
    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'Password must be at least 6 characters longs'
    })
    @IsString()
    password: string

    @IsString()
    role: string
}



export class UserDto {
    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'Password must be at least 6 characters longs'
    })
    @IsString()
    password: string

    confirmation: Boolean

    @IsString()
    role: string
}



