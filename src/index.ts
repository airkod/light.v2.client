import { Config } from "./interfaces/config";
import { Session } from "./interfaces/session";
import { CryptHelper } from "./helpers/crypt-helper";
import { Workspace } from "./interfaces/workspace";
import { Body } from "./interfaces/body";

export class LightV2Client {
  config: Config = null;
  session: Session = null;

  constructor(config: Config) {
    this.config = config;
  }

  private auth(): Promise<Session> {
    return new Promise((resolve, reject) => {
      const data: Workspace = {
        body: {
          login: this.config.login,
          password: this.config.password,
        },
      };
      this.requestRaw<Session>("auth", data)
        .then((session: Session) => {
          this.session = session;
          resolve(session);
        })
        .catch(e => reject(e));
    });
  }

  private isValidAccessToken(): boolean {
    return this.session?.accessTokenExpires > Math.ceil(Date.now() / 1000);
  }

  private async request<T>(url: string, workspace: Workspace): Promise<T> {
    if (!this.isValidAccessToken()) {
      await this.auth();
    }

    workspace.meta.accessToken = this.session.accessToken;
    return this.requestRaw(url, workspace);
  }

  private requestRaw<T>(url: string, data: Workspace): Promise<T> {
    return new Promise((resolve, reject) => {
      data.meta = data.meta || {};
      data.meta.apiKey = this.config.apiKey;

      CryptHelper.encrypt(data, this.config.signature)
        .then((body: any) => {
          const requestOptions: RequestInit = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
          };

          fetch(this.config.host + url, requestOptions)
            .then(async (response) => {
              if (response.status === 401) {
                await this.auth();
                data.meta.accessToken = this.session.accessToken;
                const body = await CryptHelper.encrypt(data, this.config.signature);
                requestOptions.body = JSON.stringify(body);

                return fetch(this.config.host + url, requestOptions);
              }

              return response;
            })
            .then(data => data.json())
            .then(data => {
              CryptHelper.decrypt(data, this.config.signature)
                .then((decryptedData: any) => resolve(decryptedData))
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
  }

  public all<T>(collection: string, query: Body = {}): Promise<{ count: number, data: Array<T> }> {
    return this.request("all", {
      meta: { collection: collection },
      body: query,
    });
  }

  public one<T>(collection: string, query: Body = {}): Promise<T> {
    return this.request("one", {
      meta: { collection: collection },
      body: query,
    });
  }

  public count(collection: string, cond: any = {}): Promise<number> {
    return this.request("count", {
      meta: { collection: collection },
      body: { cond },
    });
  }

  public insertOne(collection: string, data: any): Promise<void> {
    return this.request("insertOne", {
      meta: { collection: collection },
      body: { data },
    });
  }

  public insertMany(collection: string, data: Array<any>): Promise<void> {
    return this.request("insertMany", {
      meta: { collection: collection },
      body: { data },
    });
  }

  public updateOne(collection: string, cond: any, data: any): Promise<void> {
    return this.request("updateOne", {
      meta: { collection: collection },
      body: { cond, data },
    });
  }

  public updateMany(collection: string, cond: any, data: any): Promise<void> {
    return this.request("updateMany", {
      meta: { collection: collection },
      body: { cond, data },
    });
  }

  public deleteOne(collection: string, cond: any): Promise<void> {
    return this.request("deleteOne", {
      meta: { collection: collection },
      body: { cond },
    });
  }

  public deleteMany(collection: string, cond: any): Promise<void> {
    return this.request("deleteMany", {
      meta: { collection: collection },
      body: { cond },
    });
  }

  public command<T>(collection: string, command: any): Promise<T> {
    return this.request("command", {
      meta: { collection: collection },
      body: { command },
    });
  }
}
