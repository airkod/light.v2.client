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
