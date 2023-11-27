export class CryptHelper {

  static async encrypt(value: any, signature: string): Promise<any> {
    return new Promise((resolve) => {
      let plaintext = JSON.stringify(value);
      let cypherTextParts = [];
      let salt = Math.random().toString().slice(2);

      plaintext = Array.from(plaintext).map(function(c) {
        if (c.charCodeAt(0) < 128) {
          return c.charCodeAt(0).toString(16).padStart(2, "0");
        }
        return encodeURIComponent(c).replace(/\%/g, "").toLowerCase();
      }).join("");

      const plaintextMatch = plaintext.match(/.{1,2}/g).map(x => parseInt(x, 16));

      for (let i = 0; i < plaintextMatch.length; i++) {
        cypherTextParts.push(
          plaintextMatch[i]
          ^ signature.charCodeAt(Math.floor(i % signature.length))
          ^ salt.charCodeAt(Math.floor(i % salt.length)),
        );
      }

      // Convert to hex
      cypherTextParts = cypherTextParts.map((x) => {
        return x.toString(16).padStart(2, "0");
      });
      const cypherText = cypherTextParts.join("");

      resolve([ cypherText, salt ]);
    });
  }

  static async decrypt(data: Array<string>, signature: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let [ cypherText, salt ] = data;

        const cypherTextParts = cypherText.match(/.{1,2}/g).map((x: string) => parseInt(x, 16));
        let plaintext = [];

        for (let i = 0; i < cypherTextParts.length; i++) {
          plaintext.push((
            cypherTextParts[i]
            ^ signature.charCodeAt(Math.floor(i % signature.length))
            ^ salt.charCodeAt(Math.floor(i % salt.length))
          ).toString(16).padStart(2, "0"));
        }
        const decryptedData = JSON.parse(decodeURIComponent("%" + plaintext.join("").match(/.{1,2}/g).join("%")));
        resolve(decryptedData);

      } catch (e) {
        reject(e);
      }
    });
  }
}
