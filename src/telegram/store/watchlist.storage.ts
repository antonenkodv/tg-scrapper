import {difference, union} from 'lodash'
import {ConflictException} from "@nestjs/common";

export class WatchlistStorage {
    private MAX_WATCHLIST_SIZE = 30;
    private watchList: string[] = [];

    get() {
        return this.watchList;
    }

    addToWatchList(wallets: string[]) {
        const updatedWatchList = union(this.watchList, wallets);

        if (updatedWatchList.length > this.MAX_WATCHLIST_SIZE) {
            throw new ConflictException('Coin can be watched by up to 30 wallets');
        }

        this.watchList = updatedWatchList;
        return this.watchList;
    }

    removeFromWatchList(wallets: string[]) {
        this.watchList = difference(this.watchList, wallets);
        return this.watchList;
    }
}
