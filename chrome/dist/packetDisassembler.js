// MARK: class PacketDisassembler
/**
 * A class that disassembles a byte array into packets.
 */
class PacketDisassembler {
    // MARK: #discardBits
    /**
     * Discards the specified number of bits from the binary array.
     * @param {number} bits The number of bits to discard.
     * @returns {void}
     */
    #discardBits(bits) {
        // Ensure there are enough bits in the binary array.
        if (this.binaryArray.length < bits) {
            throw new Error("Not enough data in the binary array.");
        }

        // Discard the first 'bits' number of bits from the binary array.
        this.binaryArray.splice(0, bits);
    }

    // MARK: #getFloat
    /**
     * Removes 32 bits from the binary array and converts them to a float.
     * @returns {number} The float value of the removed bits.
     */
    #getFloat() {
        // Ensure there are enough bits in the binary array.
        if (this.binaryArray.length < 32) {
            throw new Error("Not enough data in the binary array.");
        }

        // Convert the bits to a string and parse it as a binary float.
        const buffer = new ArrayBuffer(4);
        const array = new Uint8Array(buffer);

        for (let i = 0; i < 4; i++) {
            array[i] = this.#getInt(8);
        }

        return new DataView(buffer).getFloat32(0, true);
    }

    // MARK: #getInt
    /**
     * Removes the specified number of bits from the binary array and converts them to an integer.
     * @param {number} bits The number of bits to remove.
     * @returns {number} The integer value of the removed bits.
     */
    #getInt(bits) {
        // Ensure there are enough bits in the binary array.
        if (this.binaryArray.length < bits) {
            throw new Error("Not enough data in the binary array.");
        }

        // Get the first 'bits' number of bits from the binary array.
        const bitsArray = this.binaryArray.splice(0, bits);

        // Convert the bits to a string and parse it as a binary integer.
        return parseInt(bitsArray.map((bit) => bit ? 1 : 0).join(""), 2);
    }

    // MARK: #getPacket
    /**
     * Gets the packet data based on the packet type.
     * @param {number} packetType The type of the packet.
     * @returns {object} The packet data.
     */
    #getPacket(packetType) {
        const packet = {};

        switch (packetType) {
            case 2:
                // Game start.
                packet.type = "gameStart";
                packet.level = this.#getInt(8);
                this.#discardBits(6);
                break;
            case 3:
                // Game end.
                packet.type = "gameEnd";
                break;
            case 4:
                // Placement.
                packet.type = "placement";

                switch (this.#getInt(3)) {
                    case 0:
                        packet.nextPiece = "I";
                        break;
                    case 1:
                        packet.nextPiece = "O";
                        break;
                    case 2:
                        packet.nextPiece = "L";
                        break;
                    case 3:
                        packet.nextPiece = "J";
                        break;
                    case 4:
                        packet.nextPiece = "T";
                        break;
                    case 5:
                        packet.nextPiece = "S";
                        break;
                    case 6:
                        packet.nextPiece = "Z";
                        break;
                }

                this.#discardBits(11);
                packet.pushdown = this.#getInt(4);
                break;
            case 5:
                // Full board.
                packet.type = "fullBoard";
                this.delay = this.#getInt(12);
                this.#discardBits(400);
                break;
            case 6:
                // Abbreviated board.
                packet.type = "abbreviatedBoard";
                this.delay = this.#getInt(12);
                this.#discardBits(11);
                break;
            case 7:
                // Recovery.
                packet.type = "recovery";
                packet.startLevel = this.#getInt(8);
                this.#discardBits(406);
                packet.score = this.#getInt(26);
                packet.level = this.#getInt(8);
                packet.lines = this.#getInt(16);
                this.#discardBits(4);
                packet.numTetrises = this.#getInt(16);
                break;
            case 9: {
                // Countdown.
                packet.type = "countdown";
                this.delay = this.#getInt(12);

                const countdown = this.#getInt(4);

                switch (countdown) {
                    case 14:
                        packet.notInGame = true;
                        break;
                    case 15:
                        packet.linecapReached = true;
                        break;
                    default:
                        packet.countdown = countdown;
                        break;
                }

                break;
            }
            case 10:
                // Stackrabbit placement.
                packet.type = "stackrabbitPlacement";
                packet.playerEval = this.#getFloat();
                packet.bestEval = this.#getFloat();
                break;
            case 11:
                // Full state.
                packet.type = "fullState";
                this.delay = this.#getInt(12);
                this.#discardBits(403);
                packet.score = this.#getInt(26);
                packet.level = this.#getInt(8);
                packet.lines = this.#getInt(16);
                break;
            default:
                console.log("=== Unknown Packet Type ===", packetType);
                throw new Error("Unknown packet type.");
        }

        return packet;
    }

    // MARK: constructor
    /**
     * Creates an instance of PacketDisassembler.
     * @param {Uint8Array} byteArray The byte array to disassemble.
     */
    constructor(byteArray) {
        // Convert the byte array to a flat binary array of true and false.
        this.binaryArray = Array.from(byteArray).flatMap((byte) => byte.toString(2).padStart(8, "0").split("").map((bit) => bit === "1"));

        // Array to hold the disassembled packets.
        this.packets = [];

        // Get the player number.
        const playerId = this.#getInt(8);
        if (playerId > 1) {
            console.log("=== Invalid player ID ===", playerId);
            return;
        }

        while (true) {
            // Get the packet type.
            const packetType = this.#getInt(5);

            // If the packet type is 0, break the loop.
            if (packetType === 0) {
                break;
            }

            let packet;

            // Get the packet data based on the packet type.
            try {
                packet = this.#getPacket(packetType);
            } catch {
                return;
            }

            packet.playerId = playerId;

            // Add the packet data to the packets array.
            this.packets.push(packet);
        }
    }
}

export default PacketDisassembler;
