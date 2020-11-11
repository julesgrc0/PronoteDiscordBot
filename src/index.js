require("dotenv").config();
const pronote = require('pronote-api');
const login = require("./pronote");
const bot = require("./bot");

const username = process.env.USERNAME_PRONOTE;
const url = process.env.URL_PRONOTE
const password = process.env.PASSWORD_PRONOTE

login(username,password,url).then(session=>{
    bot(process.env.DISCORD_BOT_TOKEN,session);
}).catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        console.error('Mauvais identifiants');    
    } else {
        Object.keys(pronote.errors).map(code=>{
            if(err.code == pronote.errors[code].code){
                console.log(code);
            }
        })
    }
});
