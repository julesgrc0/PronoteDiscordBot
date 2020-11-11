const Discord = require("discord.js");
const pronote = require("pronote-api");
const login = require("./pronote");
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const LICENCE = `MIT License

Copyright (c) 2020 Jules GARCIA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

module.exports = (token, session) => {
    const client = new Discord.Client();

    client.on("ready", () => {
        console.log(`Success to start ${client.user.tag} !`);
    });

    client.on("message", (msg) => {

        if (msg.content.split(" ").length == 3) {
            let m = msg.content.split(" ");
            if (m[0] == "!login" || m[0] == "!notes") {
                let isL = m[0];
                msg.delete();
                const username = m[1];
                const pass = m[2];
                login(username, pass, process.env.URL_PRONOTE).then(se => {
                    se.marks().then(m => {
                        if (isL == "!login") {
                            let moyenne = m.averages.student;
                            let groupe = se.user.groups[2].name.split(" ")[1];
                            let avatar = se.user.avatar;
                            let classN = se.user.studentClass.name;

                            msg.channel.send(`
NOM,Prenom: ${se.user.name}
Groupe: ${groupe}
Class: ${classN}
Moyenne: ${moyenne}
                        `, { files: [avatar] });
                        } else {
                                msg.reply("Toutes vos notes vont vous être transmises en DM (Message privé)!");
                                msg.member.createDM().then(cha => {
                                    
                                    cha.send("Voici toutes la liste de vos notes (peut prendre du temps a charger): ");
                                    m.subjects.map(note => {
                                        cha.send("Voici vos notes en " + note.name + " :")
                                        note.marks.map(info => {
                                            cha.send("\nEvaluation du " + info.date.toLocaleDateString().replace(/-/g, "/")
                                                + "\n Nom: " + info.title
                                                + "\n Coefficient: " + info.coefficient
                                                + "\n Votre note: " + info.value + "/" + info.scale
                                                + "\n Meilleur note: " + info.max + "/" + info.scale
                                                + "\n Pire note: " + info.min + "/" + info.scale
                                            )

                                        })
                                    })
                                    cha.send("La votre moyenne est donc de " + m.averages.student + "/20 ");
                                })
                            }
                    })
                }).catch(err => {
                    msg.reply("Vos indentifiant sont invalid !");
                })
            }
        } else {

            try {
                switch (msg.content) {
                    case "!devoirs":
                        session.homeworks().then((works) => {
                            works.map((work) => {
                                msg.reply(
                                    ucfirst(work.subject.toLowerCase()) +
                                    "\n" +
                                    work.description +
                                    "\n\n Faire avant le " +
                                    work.for.toLocaleDateString().replace(/-/g, "\\")
                                );
                            });
                        });
                        break;
                    case "!cours":
                        session.timetable().then((cours) => {
                            msg.reply("Vous avez " + cours.length + " aujourd'hui :");
                            cours.map((cour) => {
                                msg.reply(
                                    ucfirst(cour.subject.toLowerCase(cour.subject)) +
                                    "\n Avec: " +
                                    cour.teacher +
                                    "\n En Salle: " +
                                    (cour.room ? cour.room : " ? ") +
                                    "\n Status: " +
                                    (cour.isCancelled ? "Cour maintenue" : "Cour annuler") +
                                    "\n A " +
                                    cour.from.toLocaleTimeString().split(":")[0] +
                                    "h" +
                                    cour.from.toLocaleTimeString().split(":")[1]
                                );
                            });
                        });
                        break;
                    case "!eval":
                        session.evaluations().then((evals) => {
                            if (evals.length == 0) {
                                msg.reply("N'avez pas d'évaluation cette semaine !");
                            } else {
                                msg.reply(
                                    "Vous avez " + evals.length + " evaluation dans la semaine:"
                                );

                                evals.map((eval) => {
                                    msg.reply(
                                        "Evaluation de " +
                                        eval.evaluations +
                                        "\nAvec " +
                                        eval.teacher +
                                        "\nSur " +
                                        eval.name +
                                        ""
                                    );
                                });
                            }
                        });
                        break;
                    case "!allinfo":
                        session.infos().then(infos => {
                            infos.map(info => {
                                msg.channel.send(info.title + " - " + info.author + "\n" +
                                    info.content +
                                    "\n" + info.date.toLocaleDateString().replace(/-/g, "\\")
                                )
                            })
                        })
                        break;
                    case "!info":
                        session.infos().then(infos => {
                            infos.map((info, i) => {
                                if (i >= infos.length - 5) {
                                    msg.channel.send(info.title + " - " + info.author + "\n" +
                                        info.content +
                                        "\n" + info.date.toLocaleDateString().replace(/-/g, "\\")
                                    )
                                }
                            })
                        })
                        break;
                    case "!pronote":
                        msg.reply("Bot Pronote créé par Jules GARCIA\n Github: https://github.com/JulesG10\n " + LICENCE)
                        break;
                    case "!moyenne":
                        session.marks().then(e => {
                            msg.reply("La moyenne de la class est de " + e.averages.studentClass + "/20 ");
                        })
                        break;
                    case "!class":
                        msg.reply(session.user.studentClass.name);
                        break;
                    case "!clear":
                        msg.channel.bulkDelete(100);
                        break;
                    case "!menu":
                        /**
                         *  TODO
                         */
                        // session.menu().then(menus=>{
                        //     menus.map(menu=>{

                        //     })
                        // })
                        break;
                }
            } catch{ }
        }

    });
    client.login(token);
};
