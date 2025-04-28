// MARK: class Commentary
/**
 * Class to handle commentary for the game.
 */
class Commentary {
    static #drought = {
        5: [
            "{{name}} is managing this {{drought}}-drought well.",
            "{{name}} is in complete control despite the {{drought}}-drought.",
            "This {{drought}}-drought is no match for {{name}}.",
            "{{name}} is breezing through this {{drought}}-drought.",
            "{{name}} is handling this {{drought}}-drought like a pro.",
            "It's smooth sailing for {{name}} in this {{drought}}-drought.",
            "It's a {{drought}}-drought, but don't tell {{name}}.",
            "This {{drought}}-drought is nothing for {{name}}."
        ],
        4: [
            "This {{drought}}-drought is giving {{name}} a bit of a challenge.",
            "{{name}} is handling this {{drought}}-drought with a bit of difficulty.",
            "The {{drought}}-drought is starting to test the patience of {{name}}.",
            "{{name}} is starting to feel the pressure of this {{drought}}-drought.",
            "This {{drought}}-drought is doing no favors for {{name}}.",
            "This {{drought}}-drought is tough, but {{name}} can still handle it.",
            "These pieces are not being kind to {{name}} in this {{drought}}-drought.",
            "{{name}} is starting to crack under this {{drought}}-drought."
        ],
        3: [
            "{{name}} is struggling to keep up with this {{drought}}-drought.",
            "This {{drought}}-drought is starting to cause problems for {{name}}.",
            "{{name}} is finding it hard to recover from this {{drought}}-drought.",
            "This {{drought}}-drought is putting {{name}} in a tough spot.",
            "{{name}} is in a {{drought}}-drought and is starting to feel the heat.",
            "{{name}} had better plans before this {{drought}}-drought hit.",
            "The pressure is on for {{name}} with this {{drought}}-drought.",
            "{{name}} would be in a better place without this {{drought}}-drought."
        ],
        2: [
            "{{name}} is in a {{drought}}-drought and is barely holding on.",
            "This {{drought}}-drought is pushing {{name}} to the brink.",
            "{{name}} is in serious trouble with this {{drought}}-drought.",
            "This {{drought}}-drought is making it hard for {{name}} to stay in the game.",
            "{{name}} is in a {{drought}}-drought and is struggling to recover.",
            "{{name}} can't take much more of this {{drought}}-drought.",
            "This {{drought}}-drought is ruining {{name}}'s game.",
            "The game is showing no mercy to {{name}} with this {{drought}}-drought."
        ],
        1: [
            "Is this {{drought}}-drought going to be the end of {{name}}?",
            "{{name}} is on the verge of disaster with this {{drought}}-drought.",
            "This {{drought}}-drought might be too much for {{name}} to handle.",
            "{{name}} is staring down defeat from this {{drought}}-drought.",
            "{{name}} is in an impossible situation with this {{drought}}-drought.",
            "What a disaster for {{name}}!  This {{drought}}-drought could be the end.",
            "{{name}} is in a {{drought}}-drought and is on the verge of topping out.",
            "{{name}} had a good run, but this {{drought}}-drought might be too much."
        ],
        0: [
            "{{name}} is in the middle of a {{drought}}-drought.",
            "{{name}} is waiting for the right piece in this {{drought}}-drought.",
            "This {{drought}}-drought is making {{name}} wait to score Tetrises.",
            "{{name}} is staying patient through this {{drought}}-drought.",
            "No bar in sight for {{name}} during this {{drought}}-drought.",
            "{{name}} isn't going to be thanking RNG for this {{drought}}-drought.",
            "{{name}} is in a {{drought}}-drought and is waiting for the bar.",
            "A {{drought}}-drought is in full effect for {{name}}."
        ]
    };

    static #evaluations = {
        5: {
            4: [
                "{{name}} has cleaned things up.",
                "{{name}} is back in control.",
                "{{name}} has turned this around.",
                "{{name}} is back to a clean board."
            ],
            3: [
                "{{name}} is back to the bottom.",
                "{{name}} has cleared the mess and is ready to go.",
                "{{name}} is back in the zone.",
                "{{name}} has reset the board."
            ],
            2: [
                "{{name}} dug out of that fast.",
                "{{name}} made quick work of that dig.",
                "{{name}} is out of trouble in record time.",
                "{{name}} escaped that dig with ease."
            ],
            1: [
                "{{name}} was on the highway to the danger zone, but flew out of that one like an absolute maverick. Hell yeah!",
                "{{name}} pulled off a miraculous recovery!",
                "{{name}} just escaped a disaster!",
                "{{name}} turned a nightmare into a dream!"
            ]
        },
        4: {
            5: [
                "{{name}} is running into a bit of traffic.",
                "{{name}} is hitting some turbulence.",
                "{{name}} is facing a few bumps in the road.",
                "{{name}} is getting a little messy."
            ],
            3: [
                "{{name}} is getting this cleaned up.",
                "{{name}} is tidying up the board.",
                "{{name}} is making progress on this mess.",
                "{{name}} is working their way out of trouble."
            ],
            2: [
                "{{name}} is almost out of this dig.",
                "{{name}} is close to clearing the danger.",
                "{{name}} is nearly free of the mess.",
                "{{name}} is on the verge of recovery."
            ],
            1: [
                "{{name}} miraculously survived that close call!",
                "{{name}} just barely made it out alive!",
                "{{name}} pulled off an incredible save!",
                "{{name}} escaped by the skin of their teeth!"
            ]
        },
        3: {
            5: [
                "{{name}} had a couple of unfortunate placements there.",
                "{{name}} made a few missteps.",
                "{{name}} is dealing with some awkward pieces.",
                "{{name}} is struggling with some bad drops."
            ],
            4: [
                "{{name}} is getting into even more trouble.",
                "{{name}} finds themself in a bigger mess.",
                "{{name}} is in a bad situation.",
                "{{name}} is finding it hard to recover."
            ],
            2: [
                "{{name}} is starting to dig this down.",
                "{{name}} is making progress on this stack.",
                "{{name}} is beginning to clear the danger.",
                "{{name}} is working on stabilizing the board."
            ],
            1: [
                "That was close, {{name}} should be able to get out of this.",
                "{{name}} is hanging on by a thread.",
                "{{name}} is in a tight spot but is recovering.",
                "{{name}} is on the edge but still in the game."
            ]
        },
        2: {
            5: [
                "Oh wow, {{name}} got into trouble fast!",
                "{{name}} is suddenly in a bad position!",
                "{{name}} is in hot water!",
                "{{name}} is in a tough spot out of nowhere!"
            ],
            4: [
                "{{name}} doesn't like what's happening here.",
                "{{name}} is not in a good place right now.",
                "{{name}} is struggling with the current board.",
                "{{name}} is facing some serious challenges."
            ],
            3: [
                "It's starting to get dangerous for {{name}}.",
                "{{name}} is entering dangerous territory.",
                "{{name}} is in a precarious situation.",
                "{{name}} is on shaky ground."
            ],
            1: [
                "Can {{name}} actually survive this?",
                "{{name}} has escaped the worst, but this is still bad.",
                "{{name}} is fighting for survival!",
                "{{name}} is trying to claw their way back from disaster!"
            ]
        },
        1: {
            5: [
                "Wait, {{name}}?  I didn't even see what happened!",
                "{{name}} just fell apart out of nowhere!",
                "{{name}} is suddenly in shambles!",
                "{{name}} went from fine to disaster in an instant!"
            ],
            4: [
                "{{name}} is suddenly in a really bad spot!",
                "{{name}} is in a dire situation!",
                "{{name}} is in serious trouble!",
                "{{name}} is facing a critical moment!"
            ],
            3: [
                "{{name}} is spiraling out of control!",
                "{{name}} is losing their grip on the game!",
                "{{name}} is in freefall!",
                "{{name}} is struggling to regain control!"
            ],
            2: [
                "This could be it for {{name}}!",
                "{{name}} is on the verge of topping out!",
                "{{name}} is in a do-or-die situation!",
                "{{name}} is staring down defeat!"
            ]
        }
    };

    static #nearTie = [
        "The game is neck and neck.",
        "This is a close game.",
        "We've got a neck alert.",
        "They're evenly matched at the moment.",
        "It's anyone's game.",
        "It's a close one."
    ];

    static #numbers = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
        "twenty",
        "twenty-one",
        "twenty-two",
        "twenty-three",
        "twenty-four",
        "twenty-five",
        "twenty-six",
        "twenty-seven",
        "twenty-eight",
        "twenty-nine",
        "thirty",
        "thirty-one",
        "thirty-two",
        "thirty-three",
        "thirty-four",
        "thirty-five",
        "thirty-six",
        "thirty-seven",
        "thirty-eight",
        "thirty-nine",
        "forty",
        "forty-one",
        "forty-two",
        "forty-three",
        "forty-four",
        "forty-five",
        "forty-six",
        "forty-seven",
        "forty-eight",
        "forty-nine",
        "fifty",
        "fifty-one",
        "fifty-two",
        "fifty-three",
        "fifty-four",
        "fifty-five",
        "fifty-six",
        "fifty-seven",
        "fifty-eight",
        "fifty-nine",
        "sixty",
        "sixty-one",
        "sixty-two",
        "sixty-three",
        "sixty-four",
        "sixty-five",
        "sixty-six",
        "sixty-seven",
        "sixty-eight",
        "sixty-nine hey now",
        "seventy",
        "seventy-one",
        "seventy-two",
        "seventy-three",
        "seventy-four",
        "seventy-five",
        "seventy-six",
        "seventy-seven",
        "seventy-eight",
        "seventy-nine",
        "eighty",
        "eighty-one",
        "eighty-two",
        "eighty-three",
        "eighty-four",
        "eighty-five",
        "eighty-six",
        "eighty-seven",
        "eighty-eight",
        "eighty-nine",
        "ninety",
        "ninety-one",
        "ninety-two",
        "ninety-three",
        "ninety-four",
        "ninety-five",
        "ninety-six",
        "ninety-seven",
        "ninety-eight",
        "ninety-nine"
    ];

    static #tetris = [
        "Tetris for {{playerName}}",
        "{{playerName}} scores a Tetris",
        "Boom, Tetris for {{playerName}}",
        "Bang, Tetris for {{playerName}}",
        "{{playerName}} bangs down a Tetris",
        "Bangarang Tetris for {{playerName}}"
    ];

    // MARK: static #numberToSpeech
    /**
     * Converts a number to a speech string.
     * @param {number} number The number.
     * @param {boolean} [entireNumber] Whether to include the entire number.
     * @returns {string} The speech string for the number.
     */
    static #numberToSpeech(number, entireNumber) {
        let string = "";

        // Always speak the entire number if we get a hey now out of it.
        if (number % 1000 === 420 || number % 100 === 69) {
            entireNumber = true;
        }

        const million = Math.floor(number / 1000000);
        const hundredThousand = Math.floor(number / 100000) % 10;
        const thousand = Math.floor(number / 1000) % 100;

        // Millions.
        if (million >= 2) {
            string += `${Commentary.#numbers[million]} million `;
        } else if (million === 1) {
            string += "A million ";
        }

        // Hundred thousands.
        if (hundredThousand > 0) {
            string += `${Commentary.#numbers[hundredThousand]} `;
        }

        // Thousands.
        if (thousand === 0) {
            if (hundredThousand > 0) {
                string += "hundred thousand ";
            }
        } else {
            if (hundredThousand > 0 && thousand < 10) {
                string += "oh ";
            }
            string += `${Commentary.#numbers[thousand]} `;

            if ((entireNumber || hundredThousand === 0) && thousand !== 69 && (hundredThousand !== 4 || thousand !== 20)) {
                string += "thousand ";
            }
        }

        if (hundredThousand === 4 && thousand === 20) {
            string += "hey now ";
        }

        if (entireNumber) {
            const hundred = Math.floor(number / 100) % 10;
            const unit = number % 100;

            // Hundreds.
            if (hundred > 0) {
                string += `${Commentary.#numbers[hundred]} `;
            }

            // Units.
            if (unit === 0) {
                if (hundred > 0) {
                    string += "hundred ";
                }
            } else {
                if (hundred > 0 && unit < 10) {
                    string += "oh ";
                }
                string += `${Commentary.#numbers[unit]} `;
            }

            if (hundred === 4 && unit === 20) {
                string += "hey now ";
            }
        }

        return string.trim();
    }

    // MARK: static chasedown
    /**
     * Start a chasedown.
     * @param {string} name1 The name of the player who topped out.
     * @param {string} name2 The name of the player chasing down a score.
     * @param {number} score1 The score of the player who topped out.
     * @param {number} levelCap The level cap if it was reached, 0 otherwise.
     * @returns {string} The commentary string.
     */
    static chasedown(name1, name2, score1, levelCap) {
        return `${name1} ${levelCap ? `has reached ${levelCap} and is done` : "has topped out"}. ${name2} is in a chase down and needs to get to ${Commentary.#numberToSpeech(Math.floor((score1 + 1000) / 1000) * 1000)}.`;
    }

    // MARK: static chasedownComplete
    /**
     * The chasedown is complete.
     * @param {string} name The name of the player who won.
     * @param {number} score The score of the player who won.
     * @returns {string} The commentary string.
     */
    static chasedownComplete(name, score) {
        return `And with a score of ${Commentary.#numberToSpeech(score)}, ${name} has completed the chasedown and takes the win.  Play this out!`;
    }

    // MARK: static chasedownFailed
    /**
     * The chasedown failed.
     * @param {string} name1 The name of the player who topped out.
     * @param {string} name2 The name of the player who won (or tied).
     * @param {number} score1 The score of the player who topped out.
     * @param {number} score2 The score of the player who won (or tied).
     * @param {number} levelCap The level cap if it was reached, 0 otherwise.
     * @returns {string} The commentary string.
     */
    static chasedownFailed(name1, name2, score1, score2, levelCap) {
        if (score1 === score2) {
            return `${name1} ${levelCap ? `has reached ${levelCap} and is done` : "has topped out"}.  Both players have exactly ${Commentary.#numberToSpeech(score2, true)}.  The game ends in a tie!`;
        }

        const useEntireNumber = Math.floor(score1 / 1000) === Math.floor(score2 / 1000);

        return `${name1} ${levelCap ? `has reached ${levelCap} and is done` : "has topped out"} at ${Commentary.#numberToSpeech(score1, useEntireNumber)}.  And with a score of ${Commentary.#numberToSpeech(score2, useEntireNumber)}, ${name2} holds on and takes the win!`;
    }

    // MARK: static drought
    /**
     * A player is in a drought.
     * @param {string} name The name of the player.
     * @param {number} drought The number of pieces in the drought.
     * @param {number} evalLevel The evaluation level.
     * @returns {string} The commentary string.
     */
    static drought(name, drought, evalLevel) {
        if (!evalLevel) {
            evalLevel = 0;
        }

        // Pick a line at random.
        const index = Math.floor(Math.random() * (Commentary.#drought[evalLevel].length - 2));
        const line = Commentary.#drought[evalLevel][index];

        // Move it to the end of the array so we don't repeat it next time.
        Commentary.#drought[evalLevel].splice(index, 1);
        Commentary.#drought[evalLevel].push(line);

        return line.replace("{{name}}", name).replace("{{drought}}", drought);
    }

    // MARK: static evalState
    /**
     * The eval state has changed.
     * @param {string} name The name of the player.
     * @param {number} evalState The eval state.
     * @param {number} oldEvalState The old eval state.
     * @returns {string} The commentary string.
     */
    static evalState(name, evalState, oldEvalState) {
        const lines = Commentary.#evaluations[evalState]?.[oldEvalState];

        if (!lines) {
            return "";
        }

        // Pick a line at random.
        const index = Math.floor(Math.random() * (lines.length - 2));
        const line = lines[index];

        // Move it to the end of the array so we don't repeat it next time.
        Commentary.#evaluations[evalState]?.[oldEvalState].splice(index, 1);
        Commentary.#evaluations[evalState]?.[oldEvalState].push(line);

        return line.replace("{{name}}", name);
    }

    // MARK: static halfway
    /**
     * The halfway point of the starting level has been reached.
     * @param {string} name The name of the player.
     * @param {number} level The level the player is on.
     * @param {number} score The score of the player.
     * @returns {string} The commentary string.
     */
    static halfway(name, level, score) {
        return `${name} is at ${Commentary.#numberToSpeech(score)} halfway through ${level}.`;
    }

    // MARK: static introductions
    /**
     * The introductions for the players.
     * @param {string} name1 The name of the first player.
     * @param {string} name2 The name of the second player.
     * @param {object} player1 The player object for the first player.
     * @param {object} player2 The player object for the second player.
     * @returns {string} The commentary string.
     */
    static introductions(name1, name2, player1, player2) {
        let intro = "Let's introduce the players!  ";

        const leftLines = [
            "Starting on the left,",
            "Introducing first,",
            "On the blue side,"
        ];

        intro += leftLines[Math.floor(Math.random() * leftLines.length)];

        intro += ` ${player1.platform === "OCR" ? "a console player" : player1.platform === "ONLINE" ? "an online player" : "a bot"}`;

        const rating = [
            "with a rating of {{rating}}",
            "with {{rating}} trophies",
            "rated at {{rating}}"
        ];

        intro += ` ${rating[Math.floor(Math.random() * rating.length)].replace("{{rating}}", Commentary.#numberToSpeech(player1.trophies, true))}`;

        intro += ` and a PB of ${Commentary.#numberToSpeech(player1.highscore)},`;

        const nameLines = [
            "welcome in {{playerName}}!",
            "please welcome {{playerName}}!",
            "it's {{playerName}}!",
            "give it up for {{playerName}}!"
        ];

        intro += ` ,, ${nameLines[Math.floor(Math.random() * nameLines.length)].replace("{{playerName}}", name1)}`;

        const rightLines = [
            "And on the right,",
            "And their opponent,",
            "And on the red side,"
        ];

        intro += ` ${rightLines[Math.floor(Math.random() * rightLines.length)]}`;

        intro += ` ${player2.platform === "OCR" ? "a console player" : player2.platform === "ONLINE" ? "an online player" : "a bot"}`;

        intro += ` ${rating[Math.floor(Math.random() * rating.length)].replace("{{rating}}", Commentary.#numberToSpeech(player2.trophies, true))}`;

        intro += ` and a PB of ${Commentary.#numberToSpeech(player2.highscore)},`;

        intro += ` ${nameLines[Math.floor(Math.random() * nameLines.length)].replace("{{playerName}}", name2)} ,,`;

        return intro;
    }

    // MARK: static leadCheck
    /**
     * Do a lead check.
     * @param {string} name1 The name of the first player.
     * @param {string} name2 The name of the second player.
     * @param {number} score1 The score of the first player.
     * @param {number} score2 The score of the second player.
     * @returns {string} The commentary string.
     */
    static leadCheck(name1, name2, score1, score2) {
        const lead = Math.abs(score1 - score2);

        if (lead < 5000) {
            // Pick a near tie line at random.
            const index = Math.floor(Math.random() * (Commentary.#nearTie.length - 2));
            const nearTie = Commentary.#nearTie[index];

            // Move it to the end of the array so we don't repeat it next time.
            Commentary.#nearTie.splice(index, 1);
            Commentary.#nearTie.push(nearTie);

            return nearTie;
        }

        if (score1 >= score2) {
            return `${name1} is ahead by ${Commentary.#numberToSpeech(lead)}.`;
        }

        return `${name2} is ahead by ${Commentary.#numberToSpeech(lead)}.`;
    }

    // MARK: static leadCheckChasedown
    /**
     * Do a lead check for a chasedown.
     * @param {string} name1 The name of the player chasing down a score.
     * @param {number} score1 The score of the player chasing down a score.
     * @param {number} score2 The score of the topped out player.
     * @returns {string} The commentary string.
     */
    static leadCheckChasedown(name1, score1, score2) {
        const lead = Math.abs(score1 - score2);

        if (lead < 1000) {
            return "Almost there...";
        }

        return `${name1} still needs ${Commentary.#numberToSpeech(lead)} to chase down ${Commentary.#numberToSpeech(Math.floor((score2 + 1000) / 1000) * 1000)}.`;
    }

    // MARK: static levelMilestone
    /**
     * A level milestone has occurred.
     * @param {string} name The name of the player.
     * @param {number} level The level the player has transitioned to.
     * @param {number} score The score of the player.
     * @returns {string} The commentary string.
     */
    static levelMilestone(name, level, score) {
        return `${name} enters ${level} at ${Commentary.#numberToSpeech(score)}.`;
    }

    // MARK: static maxout
    /**
     * A player maxed out.
     * @param {string} name The name of the player who maxed out.
     * @param {boolean} [tetris] Whether the player got a Tetris to get the maxout.
     * @returns {string} The commentary string.
     */
    static maxout(name, tetris) {
        if (tetris) {
            // Pick a tetris line at random.
            const index = Math.floor(Math.random() * (Commentary.#tetris.length - 2));
            const tetrisLine = Commentary.#tetris[index];

            // Move it to the end of the array so we don't repeat it next time.
            Commentary.#tetris.splice(index, 1);
            Commentary.#tetris.push(tetrisLine);

            return `${tetrisLine.replace("{{playerName}}", name)} into the max out!`;
        }

        return `Max out for ${name}!`;
    }

    // MARK: static mullen
    /**
     * It's Mullen time!
     * @param {string} name1 The name of the player who topped out.
     * @param {string} name2 The name of the player who won.
     * @param {number} score1 The score of the player who topped out.
     * @param {number} score2 The score of the player who won.
     * @param {number} levelCap The level cap if it was reached, 0 otherwise.
     * @returns {string} The commentary string.
     */
    static mullen(name1, name2, score1, score2, levelCap) {
        return `${name1} ${levelCap ? `has reached ${levelCap} and is done` : "has topped out"} at ${Commentary.#numberToSpeech(score1)}.  And with a score of ${Commentary.#numberToSpeech(score2)}, ${name2} has won the game.  Play this out!`;
    }

    // MARK: static rollover
    /**
     * A player rolled over.
     * @param {string} name The name of the player who rolled over.
     * @param {boolean} [tetris] Whether the player got a Tetris to get the rollover.
     * @returns {string} The commentary string.
     */
    static rollover(name, tetris) {
        if (tetris) {
            // Pick a tetris line at random.
            const index = Math.floor(Math.random() * (Commentary.#tetris.length - 2));
            const tetrisLine = Commentary.#tetris[index];

            // Move it to the end of the array so we don't repeat it next time.
            Commentary.#tetris.splice(index, 1);
            Commentary.#tetris.push(tetrisLine);

            return `${tetrisLine.replace("{{playerName}}", name)} into the rollover!`;
        }

        return `Rollover for ${name}!`;
    }

    // MARK: static scoreCheck
    /**
     * Do a score check.
     * @param {string} name1 The name of the first player.
     * @param {string} name2 The name of the second player.
     * @param {number} score1 The score of the first player.
     * @param {number} score2 The score of the second player.
     * @returns {string} The commentary string.
     */
    static scoreCheck(name1, name2, score1, score2) {
        const useEntireNumber = Math.floor(score1 / 1000) === Math.floor(score2 / 1000);

        if (score1 >= score2) {
            return `${Commentary.#numberToSpeech(score1, useEntireNumber)} for ${name1}, ${Commentary.#numberToSpeech(score2, useEntireNumber)} for ${name2}.`;
        }

        return `${Commentary.#numberToSpeech(score2, useEntireNumber)} for ${name2}, ${Commentary.#numberToSpeech(score1, useEntireNumber)} for ${name1}.`;
    }

    // MARK: static scoreCheckChasedown
    /**
     * Do a score check for a chasedown.
     * @param {string} name1 The name of the player chasing down a score.
     * @param {number} score1 The score of the player chasing down a score.
     * @param {number} score2 The score of the topped out player.
     * @returns {string} The commentary string.
     */
    static scoreCheckChasedown(name1, score1, score2) {
        return `${name1} is at ${Commentary.#numberToSpeech(score1)} and still needs to chase down ${Commentary.#numberToSpeech(Math.floor((score2 + 1000) / 1000) * 1000)}`;
    }

    // MARK: static tetris
    /**
     * A player got a Tetris.
     * @param {string} name The name of the player who got the Tetris.
     * @returns {string} The commentary string.
     */
    static tetris(name) {
        // Pick a tetris line at random.
        const index = Math.floor(Math.random() * (Commentary.#tetris.length - 2));
        const tetrisLine = Commentary.#tetris[index];

        // Move it to the end of the array so we don't repeat it next time.
        Commentary.#tetris.splice(index, 1);
        Commentary.#tetris.push(tetrisLine);

        return `${tetrisLine.replace("{{playerName}}", name)}!`;
    }

    // MARK: static transition
    /**
     * A transition has occurred.
     * @param {string} name The name of the player.
     * @param {number} level The level the player has transitioned to.
     * @param {number} score The score of the player.
     * @returns {string} The commentary string.
     */
    static transition(name, level, score) {
        return `${name} has transitioned to ${level} at ${Commentary.#numberToSpeech(score)}.`;
    }
}

export default Commentary;
