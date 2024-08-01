import {Module} from '@nestjs/common';
import {TelegramModule} from "./telegram/telegram.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        TelegramModule,
        ConfigModule.forRoot(
            {
                envFilePath: '.env',
                isGlobal: true
            }
        )]
})
export class AppModule {
}
