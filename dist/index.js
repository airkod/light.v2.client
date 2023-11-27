var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CryptHelper } from "./helpers/crypt-helper";
export class LightV2Client {
    constructor(config) {
        this.config = null;
        this.session = null;
        this.config = config;
    }
    auth() {
        return new Promise((resolve, reject) => {
            const data = {
                body: {
                    login: this.config.login,
                    password: this.config.password,
                },
            };
            this.requestRaw("auth", data)
                .then((session) => {
                this.session = session;
                resolve(session);
            })
                .catch(e => reject(e));
        });
    }
    isValidAccessToken() {
        var _a;
        return ((_a = this.session) === null || _a === void 0 ? void 0 : _a.accessTokenExpires) > Math.ceil(Date.now() / 1000);
    }
    request(url, workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidAccessToken()) {
                yield this.auth();
            }
            workspace.meta.accessToken = this.session.accessToken;
            return this.requestRaw(url, workspace);
        });
    }
    requestRaw(url, data) {
        return new Promise((resolve, reject) => {
            data.meta = data.meta || {};
            data.meta.apiKey = this.config.apiKey;
            CryptHelper.encrypt(data, this.config.signature)
                .then((body) => {
                const requestOptions = {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                };
                fetch(this.config.host + url, requestOptions)
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.status === 401) {
                        yield this.auth();
                        data.meta.accessToken = this.session.accessToken;
                        const body = yield CryptHelper.encrypt(data, this.config.signature);
                        requestOptions.body = JSON.stringify(body);
                        return fetch(this.config.host + url, requestOptions);
                    }
                    return response;
                }))
                    .then(data => data.json())
                    .then(data => {
                    CryptHelper.decrypt(data, this.config.signature)
                        .then((decryptedData) => resolve(decryptedData))
                        .catch(e => reject(e));
                })
                    .catch(e => reject(e));
            })
                .catch(e => reject(e));
        });
    }
    all(collection, query = {}) {
        return this.request("all", {
            meta: { collection: collection },
            body: query,
        });
    }
    one(collection, query = {}) {
        return this.request("one", {
            meta: { collection: collection },
            body: query,
        });
    }
    count(collection, cond = {}) {
        return this.request("count", {
            meta: { collection: collection },
            body: { cond },
        });
    }
    insertOne(collection, data) {
        return this.request("insertOne", {
            meta: { collection: collection },
            body: { data },
        });
    }
    insertMany(collection, data) {
        return this.request("insertMany", {
            meta: { collection: collection },
            body: { data },
        });
    }
    updateOne(collection, cond, data) {
        return this.request("updateOne", {
            meta: { collection: collection },
            body: { cond, data },
        });
    }
    updateMany(collection, cond, data) {
        return this.request("updateMany", {
            meta: { collection: collection },
            body: { cond, data },
        });
    }
    deleteOne(collection, cond) {
        return this.request("deleteOne", {
            meta: { collection: collection },
            body: { cond },
        });
    }
    deleteMany(collection, cond) {
        return this.request("deleteMany", {
            meta: { collection: collection },
            body: { cond },
        });
    }
    command(collection, command) {
        return this.request("command", {
            meta: { collection: collection },
            body: { command },
        });
    }
    build() {
        return new Builder(this);
    }
}
export class Builder {
    constructor(client) {
        this.client = client;
        this.workspace = {
            meta: {},
            body: {},
        };
    }
    collection(collection) {
        this.workspace.meta.collection = collection;
        return this;
    }
    cond(cond) {
        this.workspace.body.cond = cond;
        return this;
    }
    sort(sort) {
        this.workspace.body.sort = sort;
        return this;
    }
    limit(limit) {
        this.workspace.body.limit = limit;
        return this;
    }
    skip(skip) {
        this.workspace.body.skip = skip;
        return this;
    }
    data(data) {
        this.workspace.body.data = data;
        return this;
    }
    command(command) {
        this.workspace.body.command = command;
        return this;
    }
    all() {
        return this.client.all(this.workspace.meta.collection, this.workspace.body);
    }
    one() {
        return this.client.one(this.workspace.meta.collection, this.workspace.body);
    }
    count() {
        return this.client.count(this.workspace.meta.collection, this.workspace.body.cond);
    }
    insertOne() {
        return this.client.insertOne(this.workspace.meta.collection, this.workspace.body.data);
    }
    insertMany() {
        return this.client.insertMany(this.workspace.meta.collection, this.workspace.body.data);
    }
    updateOne() {
        return this.client.updateOne(this.workspace.meta.collection, this.workspace.body.cond, this.workspace.body.data);
    }
    updateMany() {
        return this.client.updateMany(this.workspace.meta.collection, this.workspace.body.cond, this.workspace.body.data);
    }
    deleteOne() {
        return this.client.deleteOne(this.workspace.meta.collection, this.workspace.body.cond);
    }
    deleteMany() {
        return this.client.deleteMany(this.workspace.meta.collection, this.workspace.body.cond);
    }
    cmd() {
        return this.client.command(this.workspace.meta.collection, this.workspace.body.command);
    }
}
