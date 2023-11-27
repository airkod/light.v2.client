var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CryptHelper {
    static encrypt(value, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let plaintext = JSON.stringify(value);
                let cypherTextParts = [];
                let salt = Math.random().toString().slice(2);
                plaintext = Array.from(plaintext).map(function (c) {
                    if (c.charCodeAt(0) < 128) {
                        return c.charCodeAt(0).toString(16).padStart(2, "0");
                    }
                    return encodeURIComponent(c).replace(/\%/g, "").toLowerCase();
                }).join("");
                const plaintextMatch = plaintext.match(/.{1,2}/g).map(x => parseInt(x, 16));
                for (let i = 0; i < plaintextMatch.length; i++) {
                    cypherTextParts.push(plaintextMatch[i]
                        ^ signature.charCodeAt(Math.floor(i % signature.length))
                        ^ salt.charCodeAt(Math.floor(i % salt.length)));
                }
                // Convert to hex
                cypherTextParts = cypherTextParts.map((x) => {
                    return x.toString(16).padStart(2, "0");
                });
                const cypherText = cypherTextParts.join("");
                resolve([cypherText, salt]);
            });
        });
    }
    static decrypt(data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    let [cypherText, salt] = data;
                    const cypherTextParts = cypherText.match(/.{1,2}/g).map((x) => parseInt(x, 16));
                    let plaintext = [];
                    for (let i = 0; i < cypherTextParts.length; i++) {
                        plaintext.push((cypherTextParts[i]
                            ^ signature.charCodeAt(Math.floor(i % signature.length))
                            ^ salt.charCodeAt(Math.floor(i % salt.length))).toString(16).padStart(2, "0"));
                    }
                    const decryptedData = JSON.parse(decodeURIComponent("%" + plaintext.join("").match(/.{1,2}/g).join("%")));
                    resolve(decryptedData);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
