import {ArrayNotEmpty, IsArray, IsString, Matches} from "class-validator";

export class AddOrRemoveWalletsDto {
    @IsString({each: true})
    @IsArray()
    @ArrayNotEmpty()
    @Matches(/^0x[a-fA-F0-9]{40}$/, {each: true, message: 'Invalid Ethereum address'})
    wallets: string[];
}
