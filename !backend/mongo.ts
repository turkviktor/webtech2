import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import * as DTO from './models/DTO';
dotenv.config();

export class Mongo {
    private client: MongoClient;
    private db: Db | undefined;
    private uri: string = process.env.MONGO_URI || 'mongodb://localhost:27017';
    private dbName: string = process.env.MONGO_DB_NAME || 'test';
    public jwtSecret: string = process.env.JWT_SECRET || "secret"


    constructor() {
        this.client = new MongoClient(this.uri);
        this.client.connect()
            .then((connectedClient: MongoClient) => {
                console.log('Connected to MongoDB');
                this.client = connectedClient;
                this.db = this.client.db(this.dbName);
            })
            .catch((err: any) => {
                console.error('Error connecting to MongoDB:', err);
            });
    }

    private async getUserCollection() {
        return this.db!.collection('users');
    }

    async getUserByName(username: string): Promise<any | null> {
        const userCollection = await this.getUserCollection();
        return userCollection.findOne({ username: username });
    }

    async Login(user: DTO.Login): Promise<string | null> {
        const userCollection = await this.getUserCollection();
        const userFound = await userCollection.findOne({ username: user.username, password: user.password });
        if (!userFound) {
            return null;
        }

        const token = jwt.sign({ username: user.username,
            exp: Math.floor(Date.now() / 1000) + (3600 * 3600),
            user_id: userFound._id
        }, this.jwtSecret);

        return token;
    }

    async Register(user: DTO.Register): Promise<InsertOneResult> {
        const userCollection = await this.getUserCollection();
        const result = await userCollection.insertOne(user);
        return result;
    }

    async UpdateUser(user: DTO.Login): Promise<boolean> {
        const userCollection = await this.getUserCollection();
        const result = await userCollection.replaceOne({ username: user.username }, user);
        return result.modifiedCount === 1;
    }
}
