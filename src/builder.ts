import { Workspace } from "./interfaces/workspace";
import { LightV2Client } from "./index";

export class Builder {
  private workspace: Workspace = {
    meta: {},
    body: {},
  };

  constructor(private client: LightV2Client) {
  }

  public collection(collection: string): Builder {
    this.workspace.meta.collection = collection;
    return this;
  }

  public cond(cond: any): Builder {
    this.workspace.body.cond = cond;
    return this;
  }

  public sort(sort: any): Builder {
    this.workspace.body.sort = sort;
    return this;
  }

  public limit(limit: number): Builder {
    this.workspace.body.limit = limit;
    return this;
  }

  public skip(skip: number): Builder {
    this.workspace.body.skip = skip;
    return this;
  }

  public data(data: any): Builder {
    this.workspace.body.data = data;
    return this;
  }

  public command(command: any): Builder {
    this.workspace.body.command = command;
    return this;
  }

  public all<T>(): Promise<{ count: number, data: Array<T> }> {
    return this.client.all(this.workspace.meta.collection, this.workspace.body);
  }

  public one<T>(): Promise<T> {
    return this.client.one(this.workspace.meta.collection, this.workspace.body);
  }

  public count(): Promise<number> {
    return this.client.count(this.workspace.meta.collection, this.workspace.body.cond);
  }

  public insertOne(): Promise<void> {
    return this.client.insertOne(this.workspace.meta.collection, this.workspace.body.data);
  }

  public insertMany(): Promise<void> {
    return this.client.insertMany(this.workspace.meta.collection, this.workspace.body.data);
  }

  public updateOne(): Promise<void> {
    return this.client.updateOne(this.workspace.meta.collection, this.workspace.body.cond, this.workspace.body.data);
  }

  public updateMany(): Promise<void> {
    return this.client.updateMany(this.workspace.meta.collection, this.workspace.body.cond, this.workspace.body.data);
  }

  public deleteOne(): Promise<void> {
    return this.client.deleteOne(this.workspace.meta.collection, this.workspace.body.cond);
  }

  public deleteMany(): Promise<void> {
    return this.client.deleteMany(this.workspace.meta.collection, this.workspace.body.cond);
  }

  public cmd<T>(): Promise<T> {
    return this.client.command(this.workspace.meta.collection, this.workspace.body.command);
  }
}
