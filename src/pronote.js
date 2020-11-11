const pronote = require('pronote-api');

module.exports = (username,password,url)=>{
    return pronote.login(url, username, password);
}