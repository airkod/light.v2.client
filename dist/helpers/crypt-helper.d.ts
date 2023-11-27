export declare class CryptHelper {
    static encrypt(value: any, signature: string): Promise<any>;
    static decrypt(data: Array<string>, signature: string): Promise<any>;
}
