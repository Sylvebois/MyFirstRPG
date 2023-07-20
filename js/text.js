/*
 * Text for the story
 */

const story = {
    intro: {
        fr:
            `Vous vous ennuyez au bar du village, rêvant d'aventure au lieu de garder les poules quand vous entendez la conversation du prêtre avec le mage : 
- ... Et c'est là que j'ai vu Marcel, le troll !
- Et tu as fait quoi ?
- Ben, j'ai pris mon courage à deux mains et j'ai couru le plus vite possible jusqu'au village. Mais j'ai perdu 2-3 bricoles en route et je suppose qu'il s'est servi ...
- Ouais ... Il ne faudrait pas que ça se sache dans le village, les nouvelles vont vites. 
- Je sais, j'y ai déjà pensé et je vais dire que j'ai créé un nouveau donjon rempli de trésors qui attend les aventuriers !
- Bien vu, ça marche à tous les coups ces histoires de donjon, et puis ça relancera l'économie du village ...
- Et Marcel va en prendre pour son grade ! Allez, je t'offre une pinte pour fêter ça !

C'est l'occasion rêvée de prouver à ces pecnots que vous avez l'étoffe d'un héros. Vous vous dirigez vers la grotte de Marcel, à l'entrée du village ...`,
        en:
            `You are bored at the village bar, dreaming of adventure instead of tending the chickens when you overhear the priest's conversation with the mage: 
- ... And that's when I saw Marcel, the troll !
- And what did you do?
- Well, I plucked up my courage and ran as fast as I could to the village. But I lost a few things on the way and I guess he took them...
- Yeah ... it should not be known in the village, the news travels fast. 
- I know, I've already thought about it and I'm going to say that I've created a new dungeon full of treasures that awaits adventurers!
- Well done, it works every time these stories of dungeon, and then it will boost the economy of the village ...
- And Marcel is going to be very sorry ! Come on, I offer you a pint to celebrate !

It's the perfect opportunity to prove to these hicks that you have the right stuff to be a hero. You head towards Marcel's cave, at the entrance of the village...`
    },
    firstRun: {
        fr:
            `Quand la brume dans votre esprit se disperse, vous êtes chez vous, affalé sur le sol avec un goût de terre en bouche ... 
Quand vous sortez voir le prêtre pour comprendre ce qui s'est passé, les gloussements et ricanements de vos concitoyens vous font dire que votre quête ne s'est pas déroulée comme prévu ...
Le prêtre vous explique : "hum, Marcel a réussi à lire un parchemin de stupidité, il supprime toute l'intelligence de la cible. C'est un miracle que vous ayez pu rentrer chez vous. Il vous faudrait un casque de protection mais je l'ai ... heu ... égaré."
De toute façon, le baragouinage des lanceurs de sort ressemble à du troll commun, alors un troll qui baragouine de la magie n'a rien d'étonnant selon vous.

Vous rassemblez ce qui vous reste de courage et d'honneur et vous retournez dans la caverne, décidé à mettre une raclée à Marcel ...`,
        en:
            `When the haze in your mind dissipates, you are at home, slumped on the floor with a taste of earth in your mouth... 
When you go out to see the priest to find out what happened, the giggles and snickers of your fellow citizens make you realize that your quest did not turn out as planned...
The priest explains to you: "um, Marcel managed to read a scroll of stupidity, it suppresses all the intelligence of the target. It's a miracle you were able to get home. You would need a protective helmet but I did... uh... lost it."
Anyway, spellcaster chatter sounds like common troll, so a troll gabbling magic is not surprising in your opinion.

You gather up what courage and honor you have left and head back to the cave, determined to beat the crap out of Marcel...`
    },
    final: {
        fr:
            `Vous rentrez au village, fier et victorieux !
Vous avez vaincu Marcel, récupéré les bibelots du prêtre et pouvez enfin prouver que vous êtes un aventurier.
Vous êtes accueilli en héros, enfin presque : des potes vous offrent des bières et vous écoutent raconter votre aventure ... Tandis que d'autres vous racontent comment vous avez couvé un oeuf et picoré la terre avec vos poules quand vous étiez abruti par le sort ...
Le prêtre vous remercie et vous offre une belle besace d'or comme récompense (mais surtout en échange de votre silence à propos de sa conversation à la taverne) ...
Finalement, la journée a été plutôt bonne et vous pouvez rêver à d'autres aventures !

FIN`,
        en:
            `You return to the village, proud and victorious!
You have defeated Marcel, recovered the priest's trinkets and can finally prove that you are an adventurer.
You are welcomed as a hero, or almost: some friends offer you beers and listen to you telling your adventure... While others tell you how you hatched an egg and pecked the earth with your chickens when you were dazed by the spell...
The priest thanks you and offers you a nice gold bag as a reward (but mostly in exchange of your silence about his conversation in the tavern) ...
Finally, the day was rather good and you can dream of other adventures !
            
END`
    }
};

const dialogs = {
    firstLvl: [
        {
            fr: "Sérieusement, ce donjon commence avec une chauve-souris ?!? Et puis quoi après ? Un blob ?",
            en: "Seriously, this dungeon start with a bat ?!? And what then ? A blob ?"
        },
        { fr: "*Soupirs*", en: "*Sig*" }
    ],
    midLvl: [],
    lastLvl: []
};

const inGameTxt = {
    goDown: { fr: "Descendre ?", en: "Go Down?" },
    goUp: { fr: "Monter ?", en: "Go Up?" },
    take: { fr: "Prendre", en: "Take" }
};

const buttons = {
    start: { fr: "Démarrer", en: "Start" },
    new: { fr: "Nouveau", en: "New" },
    save: { fr: "Sauver", en: "Save" },
    backToMain: { fr: "Retour à l'accueil", en: "Back to main screen" },
    load: { fr: "Charger", en: "Load" },
    options: { fr: "Options", en: "Options" },
    credits: { fr: "Crédits", en: "Credits" },
    inv: { fr: "Inventaire", en: "Inventory" },
    menu: { fr: "Menu", en: "Menu" },
    back: { fr: "Retour", en: "Back" }
};

const forms = {
    name: { fr: "Nom : ", en: "Name : " },
    st: { fr: "Force : ", en: "Strength : " },
    dx: { fr: "Dexterité : ", en: "Dexterity :" },
    iq: { fr: "Intellect : ", en: "Intellect : " },
    ht: { fr: "Santé : ", en: "Health : " },
    pointsLeft: {
        fr: 'Il vous reste <span id="nbPoints">20</span> points à répartir.',
        en: 'There is still <span id="nbPoints">20</span> points to dispatch.'
    },
    music: { fr: "Musique : ", en: "Music : " },
    musicOn: { fr: "ON", en: "ON" },
    musicOff: { fr: "OFF", en: "OFF" },
    sound: { fr: "Sons : ", en: "Sounds : " },
    soundOn: { fr: "ON", en: "ON" },
    soundOff: { fr: "OFF", en: "OFF" },
    lang: { fr: "Langue : ", en: "Language : " },
    langFr: { fr: "Français", en: "French" },
    langEn: { fr: "Anglais", en: "English" }
};

const titles = {
    newGame: { fr: "Nouvelle partie", en: "Start a new game" },
    loadGame: { fr: "Charger une partie", en: "Load a game" },
    optionsGame: { fr: "Options", en: "Options" }
};

const credits = {
    thanks: {
        fr: `Musiques : 
Menu : The Naheulband - "A l'aventure compagnon (instrumental)"
Dans le jeu : générée par Mubert https://mubert.com/render

Graphiques :
OpenGameArt.org
Dall-E`,
        en: `Musics : 
Menu : The Naheulband - "A l'aventure compagnon (instrumental)"
In game : generated by Mubert https://mubert.com/render

Graphics :
OpenGameArt.org
Dall-E`
    }
};

export { story, buttons, forms, titles, inGameTxt };