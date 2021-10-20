/**
 *  AS 
 * Mongo DB Connection
 * 
 * 
 */

const { Collection, Client, Discord, MessageEmbed } = require('app.js')
const fs = require('fs');
const client = new Client({
    disableEveryone: true,
    patials: ["MESSAGE", "CHANNEL", "REACTION"]

});

const mongo = require('mongo')
const activitySchema = require('./Fitness/app')

const connectToMongoDB = async() => {
    await mongo().then(async(mongoose) => {
        try {
            console.log('You have connected to MongoDB!')

            const activity = {
                id: 1,
                activity: 'STEPS',
                count: 325

            }
            await new activitySchema(activity).save()
        } finally {
            mongoose.connection.close()
        }
    })
}

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mando:Diamond1@cluster0.tdv4k.mongodb.net/Fitness', {
    unifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log('Connected to Mongo DB.'))


const config = require('/config.json')
const prefix = config.prefix
const token = config.token
const db = require('Fitness.db');
const { Collection } = require('mongoose');
client.embed = new MessageEmbed()
client.commands = new Collection();
client.aliases = new Collection();
client.categories = gs.readdirsync('./commands/');
['command'].forEach(handler => {
    require('./{handlers}/${handler}')(client);
});