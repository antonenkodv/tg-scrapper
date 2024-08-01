import {Injectable} from "@nestjs/common";
import {Api} from "telegram";
import Message = Api.Message;
import {differenceInHours} from "date-fns";
import {WatchlistStorage} from "../store/watchlist.storage";

interface WalletInfo {
    prev: string;
    current: string;
    startDate: Date;
}

@Injectable()
export class BananagunBotService {
    public scrapingResults: Map<string, WalletInfo> = new Map();
    public botUsername: string = "BananaGunSniper_bot";

    constructor(private readonly watchListStorage: WatchlistStorage) {
    }

    public callback({id, message}: Message): void | Record<string, string | number> {
        if (message.includes('💡 Enter ETH Value in format “0.00”\n')) {
            const replyMessage = '0.000001/0.0000001/1';
            return {
                message: replyMessage,
                replyTo: id,
            }
        }
        if (message.includes('🍌 Token:') && message.includes('🟡 Status')) {
            this.parseResult(message);
        }
    }

    private parseResult(message: string) {
        const wallet = message.split('\n').at(1).replace('🍌 ', '').toLowerCase();
        const wallets = message.split('\n').at(4);
        let count = 0;

        if (message.includes('✅')) count = this.parseWalletsCount(message);
        if (message.includes('❌ ')) count = 0;
        if (message.includes('🍌 Safe to buy: 🟢 Safe')){
            return this.watchListStorage.removeFromWatchList([wallet])
        }


        if (this.scrapingResults.has(wallet)) {
            const walletInfo =  this.scrapingResults.get(wallet)

            if(differenceInHours(new Date(), walletInfo.startDate) > 2 ){
               return this.watchListStorage.removeFromWatchList([wallet])
            }

            this.scrapingResults.set(wallet, {
                prev: walletInfo.current,
                current: wallets,
                startDate : walletInfo.startDate
            });

            console.group([new Date()])
            console.log('Token :', wallet);
            console.log('Count :', count);
            console.log('Previous :', this.scrapingResults.get(wallet).prev);
            console.log('Current :', this.scrapingResults.get(wallet).current);
            console.groupEnd();
        }
    }

    private parseWalletsCount(message) {
        const regex =
            /✅ There are at least (\d+) wallets participating in the First Bundle or Fail/;
        const match = message.message.match(regex);
        return match ? parseInt(match[1], 10) : null;
    }
}
