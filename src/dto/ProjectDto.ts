import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export default class ProjectDto {

    @IsString()
    @MinLength(5, {
        message: 'Title is too short. Minimal value is $constraintl',
    })
    @MaxLength(255, {
        message: 'Title is too long. Maxiumum length is $constraintl',
    })
    public title: string;

    @MinLength(5, {
        message: 'Description is too short. Minimal value is $constraintl',
    })
    public description: string;

    @IsInt()
    public status: number;
}