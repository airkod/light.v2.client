import { Config } from "./interfaces/config";
import { Body } from "./interfaces/body";
export declare class LightV2Client {
    private config;
    private session;
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
    build(): Builder;
    sample(): SampleClass;
}
export declare class SampleClass {
    field: number;
}
export declare class Builder {
    private client;
    private workspace;
    constructor(client: LightV2Client);
    collection(collection: string): Builder;
    cond(cond: any): Builder;
    sort(sort: any): Builder;
    limit(limit: number): Builder;
    skip(skip: number): Builder;
    data(data: any): Builder;
    command(command: any): Builder;
    all<T>(): Promise<{
        count: number;
        data: Array<T>;
    }>;
    one<T>(): Promise<T>;
    count(): Promise<number>;
    insertOne(): Promise<void>;
    insertMany(): Promise<void>;
    updateOne(): Promise<void>;
    updateMany(): Promise<void>;
    deleteOne(): Promise<void>;
    deleteMany(): Promise<void>;
    cmd<T>(): Promise<T>;
}
