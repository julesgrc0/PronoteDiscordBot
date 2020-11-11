# Pronote-Bot-Discord

Fill the .env file for the bot and the user configuration

> Start
```cmd
npm i && npm start
```

> Deploy

```
git clone https://github.com/JulesG10/Pronote-Bot-Discord.git
heroku login
heroku git:clone -a discord-bot-pronote
cd Pronote-Bot-Discord
git add .
git commit -am "upload"
git push heroku master
```

> Commands discord

```cmd
!cours = donne la liste des cours de la journée
!devoirs = donne la liste des devoirs de la semaine
!eval = donne la liste des évaluation a venir
!moyenne = donne la moyenne de la classe
!login <identifiant> <mot de passe> = donne vos information (moyenne, groupe, etc...) (vos indentifiant pronote seront cacher)
!notes <identifiant> <mot de passe> = listes toutes vos notes en DM (vos indentifiant pronote seront cacher)
!clear = efface les 100 dernier message du salon
!pronote = donne la licence et les information sur le createur du bot
```
