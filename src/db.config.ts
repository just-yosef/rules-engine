import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { Connection } from "mongoose";
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        return {
            uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9psfy8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
            onConnectionCreate(connection: Connection) {
                connection.on('connected', () => console.log("connected with mongoDB"))
                return connection
            },
        }
    }
}   