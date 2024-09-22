const monsterData = [
    {
        id: 1,
        name: "Plasmew",
        types: ["pulse"],
        image: "/images/monster/plasmew.png",
        description: "Plasmew harnesses energy from its surroundings, converting even the faintest electromagnetic waves into ammunition. Its playful nature often leads it to tag other creatures with harmless static shocks. Researchers are baffled by its ability to boost its energy output through an unknown internal mechanism.",
        prevForm: null,
        nextForm: 2,
        stats: {
          attack: 30,
          defense: 20,
          level: 1
        },
        effect: "When Plasmew is summoned, you may draw 1 card. Once per turn, you can discard 1 card to increase Plasmew's attack by 10 until the end of your turn."
      },
    {
      id: 2,
      name: "Felazor",
      types: ["pulse"],
      image: "/images/monster/felazor.png",
      description: "Felazor possesses a unique symbiotic relationship with their organic guns. These living guns feed on Felazor's dead cells, converting it into potent energy.  Researchers have observed that the more Felazor engages in combat, the more efficient this symbiosis becomes. ",
      prevForm: 1,
      nextForm: 3,
      stats: {
        attack: 45,
        defense: 25,
        level: 2
      },
      effect: "When Felazor attacks, flip a coin. If heads, this attack deals 10 additional damage. If tails, your opponent discards 1 card from their hand."
    },
    {
      id: 3,
      name: "Starlynx",
      types: ["pulse", "chrono"],
      image: "/images/monster/starlynx.png",
      description: "Some theorize that Starlynx originated from a distant galaxy or perhaps even an alternate timeline. Its weaponry operates on principles that defy current understanding. Observers report seeing phantom images of bullets moments before the trigger is pulled, leading to speculation about its ability to manipulate time itself.",
      prevForm: 2,
      nextForm: null,
      stats: {
        attack: 65,
        defense: 35,
        level: 3
      },
      effect: "Once per turn, when Starlynx attacks, you may choose to have it attack twice. If you do, flip a coin after the second attack. If tails, Starlynx cannot attack during your next turn."    },
    {
        id: 4,
        name: "Nihiliz",
        types: ["void"],
        image: "/images/monster/nihiliz.png",
        description: "Nihiliz emits an aura of emptiness that can unsettle even the bravest of trainers. It's said that gazing into its eyes for too long can cause one to question their very existence. Despite its unsettling nature, Nihiliz is known to form deep bonds with trainers who lack the will to live.",
        prevForm: null,
        nextForm: 5,
        stats: {
          attack: 25,
          defense: 25,
          level: 1
        },
        effect: "When Nihiliz is summoned, your opponent's active monster loses 10 attack until the end of their next turn. This effect can only be used once per game."      },
      {
        id: 5,
        name: "Neantile",
        types: ["void"],
        image: "/images/monster/neantile.png",
        description: "Neantile communicates through an intricate series of gestures and movements, each with its own unique meaning. Its ability to create invisible barriers is both a defensive mechanism and a form of artistic expression. Observers often report feeling as if they're watching a silent performance when Neantile is nearby.",
        prevForm: 4,
        nextForm: 6,
        stats: {
          attack: 35,
          defense: 35,
          level: 2
        },
        effect: "Once per turn, you can make Neantile invulnerable to attacks until your next turn. If you do, Neantile cannot attack during your next turn."      },
      {
        id: 6,
        name: "Guignoleon",
        types: ["void", "death"],
        image: "/images/monster/guignoleon.png",
        description: "Guignoleon is shrouded in mystery and folklore. Its presence is said to blur the line between reality and illusion, causing onlookers to question what they see. Despite its intimidating appearance, some cultures believe encountering a Guignoleon brings good fortune – if one can overcome their initial fear.",
        prevForm: 5,
        nextForm: null,
        stats: {
          attack: 50,
          defense: 50,
          level: 3
        },
        effect: "When Guignoleon is summoned, you may swap the attack and defense of all monsters on the field until the end of your next turn. This effect can only be used once per game."      },
      {
        id: 7,
        name: "Nebulith",
        types: ["gravity"],
        image: "/images/monster/nebulith.png",
        description: "Nebulith are often found in areas with strange gravitational anomalies, leading researchers to debate whether it creates these anomalies or is simply attracted to them. Its presence is said to bring good fortune to astronomers, often coinciding with rare celestial events.",
        prevForm: null,
        nextForm: 8,
        stats: {
          attack: 20,
          defense: 30,
          level: 1
        },
        effect: "When Nebulith is attacked, flip a coin. If heads, reduce the incoming damage by 10."      },
      {
        id: 8,
        name: "Orbitot",
        types: ["gravity"],
        image: "/images/monster/orbitot.png",
        description: "Orbitot emits a mysterious aura that seems to bend light and space around it. This creature can create localized gravity wells, causing small objects to orbit around it. Trainers report being disoriented in Orbitot's presence, with some experiencing temporary loss of balance or altered perception.",
        prevForm: 7,
        nextForm: 9,
        stats: {
          attack: 30,
          defense: 40,
          level: 2
        },
        effect: "Once per turn, you may choose one of your opponent's monsters. That monster cannot attack Orbitot until the end of your next turn. If you use this effect, Orbitot's attack is reduced by 10 until the end of your next turn."      },
      {
        id: 9,
        name: "Cosmajesty",
        types: ["gravity", "royal"],
        image: "/images/monster/cosmajesty.png",
        description: "Cosmajesty is a being of immense gravitational power, often mistaken for a small celestial body by distant observers. It's said that Cosmajesty can temporarily create stable wormholes, though the destination of these cosmic shortcuts remains a mystery. Ancient legends speak of a Cosmajesty that once saved a planet by altering the trajectory of a massive asteroid.",
        prevForm: 8,
        nextForm: null,
        stats: {
          attack: 40,
          defense: 60,
          level: 3
        },
        effect: "Once per game, when Cosmajesty would be destroyed, you can instead remove it from play until the start of your next turn. When it returns, draw 2 cards."      },
        {
            id: 66,
            name: "Mortibane",
            types: ["death"],
            image: "/images/monster/mortibane.png",
            description: "Mortibane is both feared and revered in certain cultures. Some view its appearance as a sacred omen, signaling the end of one cycle and the beginning of another. Folklore suggests that those who accept their fate in Mortibane's presence may gain profound wisdom about the nature of existence. However, those who resist are said to vanish without a trace, their very essence erased from reality.",
            prevForm: null,
            nextForm: null,
            stats: {
              attack: 65,
              defense: 45,
              level: 5
            },
            effect: "Once per summon when Mortibane attacks, banish the target from the game and graveyard."      },
  ];
  
  export default monsterData;