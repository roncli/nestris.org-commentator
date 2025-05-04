import Commentary from "./commentary.js";

// MARK: class GameStatus
/**
 * A class that represents the game status in Nestris.
 */
class GameStatus {
    // MARK: static #evalLevel
    /**
     * Evaluates the level of a player's board based on the given evaluation score.
     * @param {number} score The score to evaluate.
     * @returns {number} The evaluated level.  5 is best, 1 is worst.
     */
    static #evalLevel(score) {
        if (score >= -20) {
            return 5;
        } else if (score >= -120) {
            return 4;
        } else if (score >= -250) {
            return 3;
        } else if (score >= -500) {
            return 2;
        }

        return 1;
    }

    // MARK: constructor
    /**
     * Creates an instance of GameStatus.
     * @param {number} tabId The ID of the tab where the game is running.
     */
    constructor(tabId) {
        this.tabId = tabId;
        this.inRoom = false;
        this.gameOver = false;

        /**
         * @type {{
         *  players: [object, object]
         *  names: [string, string]
         *  score: [number, number]
         *  level: [number, number]
         *  lines: [number, number]
         *  eval: [number, number]
         *  lastEvalCheck: [number, number]
         *  lastEvalCheckEval: [number, number]
         *  drought: [number, number]
         *  maxed: [boolean, boolean]
         *  rollover: [boolean, boolean]
         *  toppedOut: [boolean, boolean]
         *  lastPlacement: [number, number]
         *  startLevel: number
         *  halfway: number
         *  updateInterval: number
         *  cap: number
         *  inIntroductions: boolean
         *  swap: boolean
         *  myPlayerId: number
         * }}
         */
        this.game = {
            players: [void 0, void 0],
            names: ["", ""],
            score: [0, 0],
            level: [0, 0],
            lines: [0, 0],
            eval: [0, 0],
            lastEvalCheck: [0, 0],
            lastEvalCheckEval: [0, 0],
            drought: [0, 0],
            maxed: [false, false],
            rollover: [false, false],
            toppedOut: [false, false],
            lastPlacement: [0, 0],
            startLevel: 0,
            halfway: 0,
            updateInterval: void 0,
            cap: void 0,
            inIntroductions: false,
            swap: false,
            myPlayerId: void 0
        };
    }

    // MARK: getMyPlayerId
    /**
     * Gets the player ID of the current user, if they are playing.
     * @returns {number} The player ID of the current user, or undefined if not playing.
     */
    getMyPlayerId() {
        return this.game.myPlayerId;
    }

    // MARK: handleEval
    /**
     * Handles a Stackrabbit evaluation for a player.
     * @param {number} playerId The ID of the player whose evaluation changed.
     * @param {number} evalScore The new evaluation score of the player.
     * @returns {void}
     */
    handleEval(playerId, evalScore) {
        // Bail if last eval check was within 10 seconds, or the eval score is not valid.
        if (Date.now() - this.game.lastEvalCheck[playerId] < 15000 || !evalScore) {
            return;
        }

        const evalState = GameStatus.#evalLevel(evalScore);
        const oldEvalState = GameStatus.#evalLevel(this.game.lastEvalCheckEval[playerId]);

        if (evalState !== oldEvalState && evalState >= 1 && evalState <= 5 && oldEvalState >= 1 && oldEvalState <= 5) {
            this.game.lastEvalCheck[playerId] = Date.now();
            this.game.lastEvalCheckEval[playerId] = evalScore;

            // Send commentary based on the evaluation state.
            this.sendCommentary(Commentary.evalState(this.game.names[playerId], evalState, oldEvalState));
        }
    }

    // MARK: handleInRoomStatus
    /**
     * Handles the in room status event to update the game status.
     * @param {object} data The data to handle.
     * @param {string} me The user ID of the current user.
     * @returns {boolean} Returns true if we are in a game.
     */
    handleInRoomStatus(data, me) {
        // Bail if we are not in a multiplayer game.
        if (data.status === "none" || !data.roomState || data.roomState.type !== "MULTIPLAYER") {
            return false;
        }

        // Set the game data from the status.
        this.game.players[0] = data.roomState.players["0"];
        this.game.players[1] = data.roomState.players["1"];

        this.game.names[0] = data.roomState.players["0"].username;
        this.game.names[1] = data.roomState.players["1"].username;
        for (let i = 0; i < this.game.names.length; i++) {
            const cleanedName = this.game.names[i].replace(/[^a-zA-Z]*$/g, "").replace(/_/g, " ").trim();
            if (cleanedName) {
                this.game.names[i] = cleanedName;
            }
        }

        this.game.startLevel = data.roomState.startLevel;
        this.game.eval[0] = 0;
        this.game.eval[1] = 0;
        this.game.lastEvalCheck[0] = Date.now();
        this.game.lastEvalCheck[1] = Date.now();
        this.game.lastEvalCheckEval[0] = 0;
        this.game.lastEvalCheckEval[1] = 0;
        this.game.swap = data.roomState.players["1"].userid === me;
        if (data.roomState.players["0"].userid === me || data.roomState.players["1"].userid === me) {
            this.game.myPlayerId = this.game.swap ? 1 : 0;
        }

        // Calculate the halfway point for the starting level.
        this.halfway = Math.floor(this.game.startLevel / 16) * 50 + Math.min((this.game.startLevel % 16) * 5 + 5, 50);

        return true;
    }

    // MARK: handleIntroductions
    /**
     * Handles the introductions of the players.
     * @returns {void}
     */
    handleIntroductions() {
        this.inIntroductions = true;

        if (this.game.swap) {
            this.sendCommentary(Commentary.introductions(this.game.names[1], this.game.names[0], this.game.players[1], this.game.players[0]), true);
        } else {
            this.sendCommentary(Commentary.introductions(this.game.names[0], this.game.names[1], this.game.players[0], this.game.players[1]), true);
        }
    }

    // MARK: handleLevelChange
    /**
     * Handles a level change for a player.
     * @param {number} playerId The ID of the player whose level changed.
     * @param {number} level The new level of the player.
     * @returns {void}
     */
    handleLevelChange(playerId, level) {
        if (this.game.swap) {
            playerId = 1 - playerId;
        }

        const oldLevel = this.game.level[playerId];
        this.game.level[playerId] = level;

        // Bail if the level hasn't changed.
        if (!oldLevel || oldLevel === level) {
            return;
        }

        // Delay the call a bit.
        setTimeout(() => {
            if ([10, 13, 16, 19, 29].includes(level)) {
                // The player has transitioned to a speed increase.
                this.sendCommentary(Commentary.transition(this.game.names[playerId], level, this.game.score[playerId]));
            }

            if (level === 24 || this.game.cap && level === 34 || level >= 35 && level % 5 === 0) {
                // The player has reached a level milestone.
                this.sendCommentary(Commentary.levelMilestone(this.game.names[playerId], level, this.game.score[playerId]));
            }
        }, 33);
    }

    // MARK: handleLinesChange
    /**
     * Handles a lines change for a player.
     * @param {number} playerId The ID of the player whose lines changed.
     * @param {number} lines The new lines of the player.
     * @returns {void}
     */
    handleLinesChange(playerId, lines) {
        if (this.game.swap) {
            playerId = 1 - playerId;
        }

        const oldLines = this.game.lines[playerId];
        this.game.lines[playerId] = lines;

        // Bail if the lines haven't changed.
        if (oldLines === void 0 || oldLines === lines) {
            return;
        }

        // Delay the call a bit.
        setTimeout(() => {
            if (!this.game.maxed[playerId] && this.game.score[playerId] >= 999999) {
                // Check for a maxout.
                this.game.maxed[playerId] = true;
                this.sendCommentary(Commentary.maxout(this.game.names[playerId], lines - oldLines === 4));
                return;
            } else if (!this.game.rollover[playerId] && this.game.score[playerId] >= 1600000) {
                // Check for a rollover.
                this.game.rollover[playerId] = true;
                this.sendCommentary(Commentary.rollover(this.game.names[playerId], lines - oldLines === 4));
                return;
            } else if (lines - oldLines === 4) {
                // Check for a Tetris.
                this.sendCommentary(Commentary.tetris(this.game.names[playerId]));
            }

            if (this.halfway && oldLines < this.halfway && lines >= this.halfway && lines - oldLines <= 4) {
                // The player has reached the halfway point.
                this.sendCommentary(Commentary.halfway(this.game.names[playerId], this.game.level[playerId], this.game.score[playerId]));
            }
        }, 1);
    }

    // MARK: handlePacket
    /**
     * Handles a game packet.
     * @param {object} packet The packet to handle.
     * @returns {void}
     */
    handlePacket(packet) {
        switch (packet.type) {
            case "gameStart":
                // A player's game has started.
                this.game.score[packet.playerId] = 0;
                this.game.level[packet.playerId] = packet.level;
                this.game.lines[packet.playerId] = 0;
                this.game.eval[packet.playerId] = 0;
                this.game.lastEvalCheck[packet.playerId] = Date.now();
                this.game.lastEvalCheckEval[packet.playerId] = 0;
                this.game.maxed[packet.playerId] = false;
                this.game.rollover[packet.playerId] = false;
                this.game.toppedOut[packet.playerId] = false;
                this.game.lastPlacement[packet.playerId] = Date.now();

                if (this.game.lastPlacement[0] && this.game.lastPlacement[1]) {
                    // Introduce the players.
                    this.handleIntroductions();

                    // If both players have started the game, start score checks if they are not already running.
                    if (this.inRoom && !this.game.updateInterval) {
                        this.game.updateInterval = setInterval(this.scoreCheck.bind(this), 30000);
                    }
                }
                break;
            case "gameEnd":
                // A player's game has ended.
                this.handleTopout(packet.playerId);
                break;
            case "placement":
                // A piece was placed.
                this.game.lastPlacement[packet.playerId] = Date.now();

                // If both players have placed a piece, start score checks if they are not already running.
                if (this.inRoom && !this.game.updateInterval && this.game.lastPlacement[0] && this.game.lastPlacement[1]) {
                    this.game.updateInterval = setInterval(this.scoreCheck.bind(this), 30000);
                }

                if (packet.nextPiece === "I") {
                    this.game.drought[packet.playerId] = 0;
                } else {
                    this.game.drought[packet.playerId]++;

                    if (this.game.drought[packet.playerId] >= 20 && this.game.drought[packet.playerId] % 10 === 0) {
                        this.sendCommentary(Commentary.drought(this.game.names[packet.playerId], this.game.drought[packet.playerId], GameStatus.#evalLevel(this.game.eval[packet.playerId])));

                        // Count this as an eval check.
                        this.game.lastEvalCheck[packet.playerId] = Date.now();
                        this.game.lastEvalCheckEval[packet.playerId] = this.game.eval[packet.playerId];
                    }
                }

                break;
            case "countdown":
                // A check to see if a player's game has ended by non-standard means.
                setTimeout(() => {
                    if (packet.notInGame) {
                        this.handleTopout(packet.playerId);
                    } else if (packet.linecapReached) {
                        this.handleTopout(packet.playerId, true);
                    }
                }, packet.delay);
                break;
            case "stackrabbitPlacement":
                // A Stackrabbit evaluation for the most recent placement.
                this.game.eval[packet.playerId] = packet.playerEval;
                this.handleEval(packet.playerId, packet.playerEval);
                break;
        }
    }

    // MARK: handleRoomStateUpdate
    /**
     * Handles the room state update event to update the game status.
     * @param {object} data The data to handle.
     * @returns {void}
     */
    handleRoomStateUpdate(data) {
        // Bail if we are not in a multiplayer game.
        if (data.status === "none" || !data.roomState || data.roomState.type !== "MULTIPLAYER") {
            return;
        }

        // Detect if a player left the room, and call a topout.
        if (data.roomState.players["0"].leftRoom) {
            this.handleTopout(0);
        }

        if (data.roomState.players["1"].leftRoom) {
            this.handleTopout(1);
        }
    }

    // MARK: handleScoreChange
    /**
     * Handles a score change for a player.
     * @param {number} playerId The ID of the player whose score changed.
     * @param {number} score The new score of the player.
     * @returns {void}
     */
    handleScoreChange(playerId, score) {
        if (this.game.swap) {
            playerId = 1 - playerId;
        }

        const oldScore = this.game.score[playerId];
        this.game.score[playerId] = score;

        // Bail if the score hasn't changed.
        if (oldScore === void 0 || oldScore === score) {
            return;
        }

        // Delay the call a bit.
        setTimeout(() => {
            // Check for a pushdown maxout.
            if (!this.game.maxed[playerId] && score >= 999999 && score - oldScore < 20) {
                this.game.maxed[playerId] = true;
                this.sendCommentary(Commentary.maxout(this.game.names[playerId]));
            }

            // Check for a pushdown rollover.
            if (!this.game.rollover[playerId] && score >= 1600000 && score - oldScore < 20) {
                this.game.rollover[playerId] = true;
                this.sendCommentary(Commentary.rollover(this.game.names[playerId]));
            }

            // If the player has completed the chasedown, end the game.
            if (this.game.toppedOut[1 - playerId] && this.game.score[playerId] > this.game.score[1 - playerId]) {
                this.sendEndGame(Commentary.chasedownComplete(this.game.names[playerId], this.game.score[playerId]));
            }
        }, 1);
    }

    // MARK: handleTopout
    /**
     * Handles a player topping out.
     * @param {number} playerId The ID of the player who topped out.
     * @param {boolean} [levelCap] Whether the player reached the level cap.
     * @returns {void}
     */
    handleTopout(playerId, levelCap) {
        // Bail if the player has already topped out.
        if (this.game.toppedOut[playerId]) {
            return;
        }

        // If we're in introductions... not anymore!
        if (this.inIntroductions) {
            this.inIntroductions = false;
        }

        // Stop giving score updates.
        this.stopUpdates();

        this.game.toppedOut[playerId] = true;

        // Delay the call a bit to allow for a Tetris to fire in the case of the level cap reached.
        setTimeout(() => {
            if (this.game.toppedOut[0] && this.game.toppedOut[1]) {
                // The chasedown failed.
                this.sendEndGame(Commentary.chasedownFailed(this.game.names[playerId], this.game.names[1 - playerId], this.game.score[playerId], this.game.score[1 - playerId], levelCap ? this.game.cap : 0));
                return;
            }

            if (this.game.score[playerId] < this.game.score[1 - playerId]) {
                // The other player won, and is Mullening.
                this.sendEndGame(Commentary.mullen(this.game.names[playerId], this.game.names[1 - playerId], this.game.score[playerId], this.game.score[1 - playerId], levelCap ? this.game.cap : 0));
                return;
            }

            // Other player is in a chasedown.
            if (this.inRoom) {
                this.game.updateInterval = setInterval(this.scoreCheckChasedown.bind(this), 30000);
            }

            this.sendCommentary(Commentary.chasedown(this.game.names[playerId], this.game.names[1 - playerId], this.game.score[playerId], levelCap ? this.game.cap : 0));
        }, 50);
    }

    // MARK: introComplete
    /**
     * Handles the completion of introductions.
     * @returns {void}
     */
    introComplete() {
        this.inIntroductions = false;
    }

    // MARK: scoreCheck
    /**
     * Provides score check data for the commentator.
     * @returns {void}
     */
    scoreCheck() {
        if (Math.random() < 0.5) {
            // Do a score check.
            this.sendCommentary(Commentary.scoreCheck(this.game.names[0], this.game.names[1], this.game.score[0], this.game.score[1]));
        } else {
            // DO a lead check.
            this.sendCommentary(Commentary.leadCheck(this.game.names[0], this.game.names[1], this.game.score[0], this.game.score[1]));
        }
    }

    // MARK: scoreCheckChasedown
    /**
     * Provides score check data for the commentator during a chasedown.
     * @returns {void}
     */
    scoreCheckChasedown() {
        const chasedownPlayer = this.game.toppedOut[0] ? 1 : 0;
        if (Math.random() < 0.5) {
            // Do a score check for the chasedown player, reminding them of the target.
            this.sendCommentary(Commentary.scoreCheckChasedown(this.game.names[chasedownPlayer], this.game.score[chasedownPlayer], this.game.score[1 - chasedownPlayer]));
        } else {
            // Do a lead check for the chasedown player, reminding them of the target.
            this.sendCommentary(Commentary.leadCheckChasedown(this.game.names[chasedownPlayer], this.game.score[chasedownPlayer], this.game.score[1 - chasedownPlayer]));
        }
    }

    // MARK: sendCommentary
    /**
     * Sends commentary data to the commentator.
     * @param {string} commentary The commentary data to send.
     * @param {boolean} [isIntroduction] Whether the commentary is an introduction.
     * @returns {void}
     */
    sendCommentary(commentary, isIntroduction) {
        // Bail if we are not in a room or if we are in introductions and the commentary is not an introduction.
        if (!this.inRoom || this.gameOver || this.game.inIntroductions && !isIntroduction) {
            return;
        }

        // Send the commentary data to the commentator.
        this.sendMessage({
            type: "COMMENTARY",
            data: {
                commentary,
                isIntroduction: !!isIntroduction
            }
        });
    }

    // MARK: sendEndGame
    /**
     * Sends end game commentary data to the commentator.
     * @param {string} commentary The commentary data to send.
     * @returns {void}
     */
    sendEndGame(commentary) {
        this.stopUpdates();

        // Bail if we are not in a room.
        if (!this.inRoom || this.gameOver) {
            return;
        }

        this.gameOver = true;

        this.sendMessage({
            type: "END_GAME",
            data: {commentary}
        });
    }

    // MARK: sendMessage
    /**
     * Sends a message to the commentator.
     * @param {object} message The message to send.
     * @returns {Promise<void>}
     */
    async sendMessage(message) {
        // Check if the Firefox tab exists.
        try {
            if (!browser.tabs || !await browser.tabs.get(this.tabId)) {
                console.log("=== Tab Closed ===");
                return;
            }
        } catch {
            console.log("=== Tab Closed ===");
            return;
        }

        browser.tabs.sendMessage(this.tabId, message);
    }

    // MARK: stopUpdates
    /**
     * Stops score updates.
     * @returns {void}
     */
    stopUpdates() {
        if (this.game.updateInterval) {
            clearInterval(this.game.updateInterval);
            this.game.updateInterval = void 0;
        }
    }
}

export default GameStatus;
