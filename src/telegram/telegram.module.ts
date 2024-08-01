import {Module} from "@nestjs/common";
import {TelegramService} from "./telegram.service";
import {TelegramController} from "./telegram.controller";
import {BananagunBotService} from "./bots/bananagun.bot.service";
import {WatchlistStorage} from "./store/watchlist.storage";

@Module({
    controllers: [TelegramController],
    providers: [TelegramService, BananagunBotService,WatchlistStorage]
})
export class TelegramModule {

}
