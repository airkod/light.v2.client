import { LightV2Client } from "./index";
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
