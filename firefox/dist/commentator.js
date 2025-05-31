(() => {
    // MARK: class Commentator
    /**
     * A class to do commentary for a nestris.org game.
     */
    class Commentator {
        #introReceived = false;
        
        /** @type {SpeechSynthesisVoice} */
        static #voice;

        #observer = new MutationObserver(this.#doUpdate.bind(this));

        #speakQueue = Promise.resolve();

        // MARK: #doUpdate
        /**
         * Handles the mutation observer callback.
         * @param {MutationRecord[]} mutations The mutations that occurred.
         * @returns {void}
         */
        #doUpdate(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    const target = mutation.target;
                    switch (target) {
                        case this.player1Score.firstChild:
                            browser.runtime.sendMessage({action: "scoreChange", playerId: 0, score: +this.player1Score.innerText});
                            break;
                        case this.player2Score.firstChild:
                            browser.runtime.sendMessage({action: "scoreChange", playerId: 1, score: +this.player2Score.innerText});
                            break;
                        case this.player1Level.firstChild:
                            browser.runtime.sendMessage({action: "levelChange", playerId: 0, level: +this.player1Level.innerText});
                            break;
                        case this.player2Level.firstChild:
                            browser.runtime.sendMessage({action: "levelChange", playerId: 1, level: +this.player2Level.innerText});
                            break;
                        case this.player1Lines.firstChild:
                            browser.runtime.sendMessage({action: "linesChange", playerId: 0, lines: +this.player1Lines.innerText});
                            break;
                        case this.player2Lines.firstChild:
                            browser.runtime.sendMessage({action: "linesChange", playerId: 1, lines: +this.player2Lines.innerText});
                            break;
                    }
                }
            }
        }

        // MARK: #speak
        /**
         * Speaks the given text using the SpeechSynthesis API.
         * @param {string} text The text to speak.
         * @param {boolean} [speakSlowly] Whether to speak slowly or not.
         * @returns {Promise<void>}
         */
        #speak(text, speakSlowly) {
            if (!Commentator.#voice) {
                Commentator.#voice = window.speechSynthesis.getVoices().find((voice) => voice.name === "Microsoft Zira - English (United States)");
            }

            return new Promise((resolve) => {
                const heyNowCount = (text.match(/hey now/g) || []).length;
                if (heyNowCount > 0) {
                    browser.runtime.sendMessage({action: "heyNow", amount: heyNowCount}).then((response) => {
                        if (response && response.count) {
                            this.heyNowCounter.innerText = `Hey now counter: ${response.count}`;
                            this.#speakQueue.then().catch().then(() => this.#speak(`The HEY NOW counter is at ${response.count}.`));
                        }
                    });
                }

                const msg = new SpeechSynthesisUtterance(text);
                msg.lang = "en-US";
                msg.rate = speakSlowly ? 1.2 : 1.4;
                msg.pitch = 1;
                msg.volume = 0.5;
                msg.voice = Commentator.#voice;

                msg.addEventListener("end", () => resolve());
                msg.addEventListener("error", () => resolve());

                setTimeout(() => {
                    window.speechSynthesis.speak(msg);
                }, 1);
            });
        }

        // MARK: static async startup
        /**
         * Initializes the commentator.
         * @returns {Promise<void>}
         */
        static async startup() {
            // If the commentator is already running, reset it.
            if (window.commentator) {
                window.commentator.reset();
                window.commentator = null;
            }

            // Bail if it's puzzle wars.
            /** @type {NodeListOf<HTMLElement>} */
            const titles = document.querySelectorAll("h1.title");
            if (titles.length === 1 && titles[0].innerText === "PUZZLE WARS") {
                return;
            }

            // Start the commentator.
            let count = 0;
            while (true) {
                // Wait 1 second.
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });

                try {
                    // Start the commentator.
                    window.commentator = new Commentator();
                    return;
                } catch (err) {
                    // Try up to 5 times.
                    count++;
                    if (count >= 5) {
                        console.log("=== Failed to initialize commentator after 5 attempts. ===", err);
                        return;
                    }

                    // Reset the commentator if it was created.
                    if (window.commentator) {
                        window.commentator.reset();
                        window.commentator = null;
                    }
                }
            }
        }

        // MARK: constructor
        /**
         * Creates an instance of a commentator.
         */
        constructor() {
            // Setup the TTS voice.
            Commentator.#voice = window.speechSynthesis.getVoices().find((voice) => voice.name === "Microsoft Zira - English (United States)");
            if (!Commentator.#voice) {
                setTimeout(() => {
                    Commentator.#voice = window.speechSynthesis.getVoices().find((voice) => voice.name === "Microsoft Zira - English (United States)");
                }, 1000);
            }

            // Get the elements we need to observe.
            /** @type {NodeListOf<HTMLElement>} */
            const scores = document.querySelectorAll(".score-panel h1.prevent-select");

            /** @type {NodeListOf<HTMLElement>} */
            const stats = document.querySelectorAll(".level-lines h1.prevent-select");

            /** @type {HTMLElement} */
            this.heyNowCounter = document.querySelector(".match-info");

            this.player1Score = scores[0];
            this.player2Score = scores[2];

            this.player1Level = stats[0];
            this.player1Lines = stats[1];
            this.player2Level = stats[2];
            this.player2Lines = stats[3];

            // If the URL doesn't start with "https://nestris.org/online/room?", reset the commentator.
            window.addEventListener("popstate", () => {
                if (!location.href.startsWith("https://nestris.org/online/room?")) {
                    this.reset();
                }
            });

            // If the page is unloaded, reset the commentator.
            window.addEventListener("beforeunload", () => {
                this.reset();
            });

            // Observe the score and level elements for changes.
            this.#observer.observe(this.player1Score.firstChild, {characterData: true});
            this.#observer.observe(this.player2Score.firstChild, {characterData: true});
            this.#observer.observe(this.player1Level.firstChild, {characterData: true});
            this.#observer.observe(this.player2Level.firstChild, {characterData: true});
            this.#observer.observe(this.player1Lines.firstChild, {characterData: true});
            this.#observer.observe(this.player2Lines.firstChild, {characterData: true});

            this.processMessages = true;

            this.listener = this.handleMessage.bind(this);
            browser.runtime.onMessage.addListener(this.listener);

            browser.runtime.sendMessage({action: "scoreChange", playerId: 0, score: +this.player1Score.innerText});
            browser.runtime.sendMessage({action: "scoreChange", playerId: 1, score: +this.player2Score.innerText});
            browser.runtime.sendMessage({action: "levelChange", playerId: 0, level: +this.player1Level.innerText});
            browser.runtime.sendMessage({action: "levelChange", playerId: 1, level: +this.player2Level.innerText});
            browser.runtime.sendMessage({action: "linesChange", playerId: 0, lines: +this.player1Lines.innerText});
            browser.runtime.sendMessage({action: "linesChange", playerId: 1, lines: +this.player2Lines.innerText});
        }

        // MARK: async handleMessage
        /**
         * Handles messages from the background script.
         * @param {object} message The message to handle.
         * @returns {Promise<void>}
         */
        async handleMessage(message) {
            if (!this.processMessages) {
                return;
            }

            // Handle the message based on its type
            const {type, data} = message;

            switch (type) {
                case "COMMENTARY":
                    // Wait for the queue to finish.
                    await this.#speakQueue;

                    if (data.isIntroduction) {
                        if (this.#introReceived) {
                            return;
                        }
                        this.#introReceived = true;

                        browser.runtime.sendMessage({action: "introStarted"});

                        this.#speakQueue = this.#speakQueue.then().catch().then(() => this.#speak(data.commentary, true).then(() => {
                            browser.runtime.sendMessage({action: "introComplete"});
                        }));
                    } else {
                        this.#speakQueue = this.#speakQueue.then().catch().then(() => this.#speak(data.commentary));
                    }
                    break;

                case "END_GAME":
                    // Don't process further messages.
                    this.processMessages = false;

                    // Wait for the queue to finish.
                    await this.#speakQueue;

                    // Speak the end game message.
                    this.#speakQueue = this.#speakQueue.then().catch().then(() => this.#speak(data.commentary).then(() => {
                        this.reset();
                    }));
                    break;
            }
        }

        // MARK: reset
        /**
         * Resets the commentator.
         * @returns {void}
         */
        reset() {
            if (this.listener) {
                browser.runtime.onMessage.removeListener(this.listener);
            }
            this.listener = void 0;

            if (this.#observer) {
                this.#observer.disconnect();
            }
            this.#observer = null;

            window.commentator = null;
        }
    }

    Commentator.startup();
})();
