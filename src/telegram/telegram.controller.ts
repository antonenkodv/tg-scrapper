import {Body, Controller, Delete, Post} from "@nestjs/common";
import {AddOrRemoveWalletsDto} from "./dtos/add.or.remove.wallets.dto";
import {WatchlistStorage} from "./store/watchlist.storage";

@Controller('telegram')
export class TelegramController {

    constructor(private readonly watchlistStorage: WatchlistStorage) {
    }

    @Post('watch-list')
    addToWatchList(@Body() {wallets}: AddOrRemoveWalletsDto) {
        this.watchlistStorage.addToWatchList(wallets)
        return this.watchlistStorage.get()

    }

    @Delete('watch-list')
    removeFromWatchList(@Body() {wallets}: AddOrRemoveWalletsDto) {
        this.watchlistStorage.removeFromWatchList(wallets)
        return this.watchlistStorage.get()
    }

}
