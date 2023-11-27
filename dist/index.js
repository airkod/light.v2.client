"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightV2Client = void 0;
const crypt_helper_1 = require("./helpers/crypt-helper");
class LightV2Client {
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
            crypt_helper_1.CryptHelper.encrypt(data, this.config.signature)
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
                        const body = yield crypt_helper_1.CryptHelper.encrypt(data, this.config.signature);
                        requestOptions.body = JSON.stringify(body);
                        return fetch(this.config.host + url, requestOptions);
                    }
                    return response;
                }))
                    .then(data => data.json())
                    .then(data => {
                    crypt_helper_1.CryptHelper.decrypt(data, this.config.signature)
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
}
exports.LightV2Client = LightV2Client;
