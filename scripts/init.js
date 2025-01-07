// Load environment variables
require('dotenv').config()

const mongoose = require('mongoose');
const userModel = require('../models/user');
const saltedSha512 = require('salted-sha512');

/**
 * Initial script to insert default data
 */
(async () => {
    try {
        const adminClient = new mongoose.mongo.MongoClient(process.env.ROOT_URL);
        await adminClient.connect();


        const dbURL = `${process.env.DB}`;

        console.log("🚀 ~ dbURL:", dbURL)
        const userClient = new mongoose.mongo.MongoClient(dbURL);

        try {
            await userClient.connect();
        } catch (error) {
            const db = adminClient.db(process.env.MONGODB_DB);
            await db.command({
                createUser: process.env.MONGODB_USER,
                pwd: process.env.MONGODB_PWD,
                roles: [
                    { role: 'dbAdmin', db: process.env.MONGODB_DB },
                    { role: 'readWrite', db: process.env.MONGODB_DB },
                ],
            });

            await mongoose.connect(dbURL);

            const admin = {
                firstName: "Super",
                lastName: " Admin",
                email: process.env.ADMIN_EMAIL,
                password: saltedSha512(process.env.ADMIN_PASSWORD, process.env.SHA512_SALT_KEY),
            };
            await userModel.create(admin);
        }
        setTimeout(() => {
            // to
            process.exit(0);
        }, 1000);
    } catch (error) {
        console.log("🚀 ~ error:", error)
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
})();