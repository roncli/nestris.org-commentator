import GameStatus from "./gameStatus.js";
import PacketDisassembler from "./packetDisassembler.js";

// MARK: resetCommentator
/**
 * Reset the commentator in the Nestris game.
 * @returns {void}
 */
const resetCommentator = function() {
    if (window.commentator) {
        window.commentator.reset();
    }
};

// MARK: class Background
/**
 * Background script for the Nestris extension.
 */
class Background {
    /** @type {string} */
    static #me;

    /** @type {GameStatus[]} */
    static #games = [];

    // MARK: static #getGame
    /**
     * Create a new game status for a tab.
     * @param {number} tabId The ID of the tab to create the game status for.
     * @returns {GameStatus} The game status object.
     */
    static #getGame(tabId) {
        let game = Background.#games.find((g) => g.tabId === tabId);
        if (!game) {
            game = new GameStatus(tabId);
            Background.#games.push(game);
        }
        return game;
    }

    // MARK: static #removeGame
    /**
     * Remove the game status for a tab.
     * @param {number} tabId The ID of the tab to remove.
     * @returns {void}
     */
    static #removeGame(tabId) {
        // If the a game exists for this tab, stop updates and remove it from the list.
        Background.#games = Background.#games.filter((game) => {
            if (game.tabId === tabId) {
                game.stopUpdates();
                return false;
            }
            return true;
        });
    }

    // MARK: static onInstalled
    /**
     * Called when the extension is installed or updated.
     * @returns {void}
     */
    static onInstalled() {
        browser.storage.local.get(["heyNowCounter"]).then((result) => {
            if (result.heyNowCounter === void 0) {
                browser.storage.local.set({heyNowCounter: 0});
            }
        });
    }

    // MARK: static onHistoryStateUpdated
    /**
     * Called when the history state is updated so that we can inject the content script into the page.
     * @param {object} details The details of the navigation event.
     * @returns {void}
     */
    static onHistoryStateUpdated(details) {
        const tabId = details.tabId;

        // Get the game for this tab.
        if (details.url.startsWith("https://nestris.org/")) {
            const inRoom = details.url.startsWith("https://nestris.org/online/room?");

            // Setup the game status for this tab if it doesn't exist.
            const game = Background.#getGame(tabId);
            game.inRoom = inRoom;

            // Inject the commentator if we are in a room, reset it if we are not.
            if (inRoom) {
                browser.scripting.executeScript({
                    target: {tabId},
                    files: ["commentator.js"]
                });
            } else {
                game.stopUpdates();
                browser.scripting.executeScript({
                    target: {tabId},
                    func: resetCommentator
                });
            }
        } else {
            // If the URL is not a Nestris page, remove the game status for this tab.
            Background.#removeGame(tabId);
        }
    }

    // MARK: static onMessage
    /**
     * Called when a message is received from the content script so that we can add to the heyNow counter.
     * @param {object} message The message object.
     * @param {object} sender The sender object.
     * @param {function} sendResponse The function to send a response back to the sender.
     * @returns {boolean} True if the message will be handled asynchronously.
     */
    static onMessage(message, sender, sendResponse) {
        const tabId = sender.tab.id;

        switch (message.action) {
            case "heyNow":
                browser.storage.local.get(["heyNowCounter"], (result) => {
                    const newCount = result.heyNowCounter + message.amount;
                    browser.storage.local.set({heyNowCounter: newCount}, () => {
                        sendResponse({count: newCount});
                    });
                });
                return true;
            case "scoreChange": {
                if (message.score === 0) {
                    return false;
                }

                const game = Background.#getGame(tabId);
                game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                game.handleScoreChange(message.playerId, message.score);
                break;
            }
            case "levelChange": {
                if (message.level === 0) {
                    return false;
                }

                const game = Background.#getGame(tabId);
                game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                game.handleLevelChange(message.playerId, message.level);
                break;
            }
            case "linesChange": {
                if (message.lines === 0) {
                    return false;
                }

                const game = Background.#getGame(tabId);
                game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                game.handleLinesChange(message.playerId, message.lines);
                break;
            }
            case "introComplete": {
                const game = Background.#games.find((g) => g.tabId === tabId);
                if (game) {
                    game.introComplete();
                    game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");
                }
                break;
            }
            case "websocketMessage": {
                const data = JSON.parse(message.data);
                switch (data.type) {
                    case "chat":
                    case "connection_successful":
                    case "found_opponent":
                    case "friend_update":
                    case "go_to_page":
                    case "num_queuing_players":
                    case "on_global_chat_message":
                    case "ping":
                    case "server_announcement":
                    case "spectator_count":
                    case "trophy_change":
                        break;
                    case "in_room_status": {
                        const game = Background.#getGame(tabId);
                        game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                        if (!game.handleInRoomStatus(data, Background.#me)) {
                            Background.#removeGame(tabId);
                        }
                        break;
                    }
                    case "ME":
                        Background.#me = data.me.userid;
                        break;
                    case "room_state_update": {
                        const game = Background.#games.find((g) => g.tabId === tabId);
                        if (game) {
                            game.handleRoomStateUpdate(data);
                            game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");
                        }
                        break;
                    }
                    default:
                        console.log("=== WebSocket Message Received ===", data);
                }
                break;
            }
            case "websocketBlob": {
                const disassembler = new PacketDisassembler(message.data);

                const game = Background.#getGame(tabId);
                game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                for (const packet of disassembler.packets) {
                    game.handlePacket(packet);
                }

                break;
            }
            case "websocketOutboundBlob": {
                const game = Background.#getGame(tabId);
                game.inRoom = sender.tab.url.startsWith("https://nestris.org/online/room?");

                const myPlayerId = game.getMyPlayerId();

                if (myPlayerId === void 0) {
                    return false;
                }

                message.data.unshift(myPlayerId);

                const disassembler = new PacketDisassembler(message.data);

                for (const packet of disassembler.packets) {
                    game.handlePacket(packet);
                }

                break;
            }
        }
        return false;
    }

    // MARK: static onStartup
    /**
     * Called when the extension is started to reinitialize tabs.
     * @returns {void}
     */
    static onStartup() {
        browser.tabs.query({}).then((tabs) => {
            for (const tab of tabs) {
                if (tab.url && tab.url.startsWith("https://nestris.org/")) {
                    const inRoom = tab.url.startsWith("https://nestris.org/online/room?");
                    const game = Background.#getGame(tab.id);
                    game.inRoom = inRoom;
                    if (inRoom) {
                        browser.scripting.executeScript({
                            target: {tabId: tab.id},
                            files: ["commentator.js"]
                        });
                    } else {
                        game.stopUpdates();
                        browser.scripting.executeScript({
                            target: {tabId: tab.id},
                            func: resetCommentator
                        });
                    }
                } else {
                    // If the URL is not a Nestris page, remove the game status for this tab.
                    Background.#removeGame(tab.id);
                }
            }
        });
    }

    // MARK: static onTabRemoved
    /**
     * Called when a tab is removed to remove any game status from it.
     * @param {number} tabId The ID of the tab that was removed.
     * @returns {void}
     */
    static onTabRemoved(tabId) {
        Background.#removeGame(tabId);
    }

    // MARK: static onTabReplaced
    /**
     * Called when a tab is replaced to remove any game status from it.
     * @param {number} addedTabId The ID of the tab that was added.
     * @param {number} removedTabId The ID of the tab that was removed.
     * @returns {void}
     */
    static onTabReplaced(addedTabId, removedTabId) {
        Background.#removeGame(removedTabId);
    }
}

// Initialize the background script
browser.runtime.onInstalled.addListener(Background.onInstalled);
browser.runtime.onMessage.addListener(Background.onMessage);
browser.runtime.onStartup.addListener(Background.onStartup);
browser.webNavigation.onHistoryStateUpdated.addListener(Background.onHistoryStateUpdated);
browser.tabs.onRemoved.addListener(Background.onTabRemoved);
browser.tabs.onReplaced.addListener(Background.onTabReplaced);
