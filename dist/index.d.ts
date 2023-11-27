import { Config } from "./interfaces/config";
import { Body } from "./interfaces/body";
import { Builder } from "./builder";
export declare class LightV2Client {
    private config;
    private session;
    build: Builder;
    constructor(config: Config);
    private auth;
    private isValidAccessToken;
    private request;
    private requestRaw;
    all<T>(collection: string, query?: Body): Promise<{
        count: number;
        data: Array<T>;
    }>;
    one<T>(collection: string, query?: Body): Promise<T>;
    count(collection: string, cond?: any): Promise<number>;
    insertOne(collection: string, data: any): Promise<void>;
    insertMany(collection: string, data: Array<any>): Promise<void>;
    updateOne(collection: string, cond: any, data: any): Promise<void>;
    updateMany(collection: string, cond: any, data: any): Promise<void>;
    deleteOne(collection: string, cond: any): Promise<void>;
    deleteMany(collection: string, cond: any): Promise<void>;
    command<T>(collection: string, command: any): Promise<T>;
}
