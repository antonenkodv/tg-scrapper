import {BadRequestException, Injectable, OnModuleInit} from '@nestjs/common';
import {Api, TelegramClient} from 'telegram';
import {StoreSession} from 'telegram/sessions';
import * as readline from 'readline';
import {WatchlistStorage} from "./store/watchlist.storage";
import {NewMessage} from "telegram/events";
import * as messageMethods from "telegram/client/messages";
import {BananagunBotService} from "./bots/bananagun.bot.service";
import Message = Api.Message;
import config from "../config"

@Injectable()
export class TelegramService implements OnModuleInit {

    public client: TelegramClient;
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    constructor(public readonly watchlistStorage: WatchlistStorage,
                public readonly bananagunBotService: BananagunBotService) {
        const apiId = config.TELEGRAM.API_ID;
        const apiHash = config.TELEGRAM.API_HASH;
        const stringSession = new StoreSession('folder_name');
        this.client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });
    }

    async onModuleInit() {
        await this.initializeClient();
        this.client.addEventHandler(
            async (event) => {
                try {
                    const messageData = event.message as Message;
                    const sender = messageData?.sender as Api.User;

                    const callbacks = {
                        [this.bananagunBotService.botUsername]: async (messageData: Message) => {
                           const reply = this.bananagunBotService.callback(messageData)
                            if(reply) await this.sendMessage(this.bananagunBotService.botUsername , reply)
                        }
                    }
                    callbacks[sender?.username] && await callbacks[sender?.username](messageData);

                } catch (error) {
                    throw new BadRequestException(`Callback fail: ${error}`)
                }


            },
            new NewMessage({}),
        );
        setInterval(async () => {
            for (const wallet of this.watchlistStorage.get()) {
                if (!this.bananagunBotService.scrapingResults.get(wallet)) {
                    this.bananagunBotService.scrapingResults.set(wallet, {prev: null, current: null,startDate : new Date()})
                }
                await this.sendMessage(this.bananagunBotService.botUsername, {message: wallet})
            }

        }, 5000);
    }

    private async initializeClient() {
        await this.client.start({
            phoneNumber: () =>
                new Promise((resolve) =>
                    this.rl.question('Please enter your number: ', resolve),
                ),
            password: () =>
                new Promise((resolve) =>
                    this.rl.question('Please enter your password: ', resolve),
                ),
            phoneCode: () =>
                new Promise((resolve) =>
                    this.rl.question('Please enter the code you received: ', resolve),
                ),
            onError: (err) => console.log(err),
        });

        console.log('Connected successfully');
        this.client.session.save();
    }

    public async sendMessage(botUsername: string, message: messageMethods.SendMessageParams) {
        try {
            await this.client.sendMessage(botUsername, message);
        } catch (error) {
            throw new BadRequestException(`Failed to send message: ${error}`)
        }
    }
}
