(() => {
    // Prevent duplicate execution
    if (window.hasWebSocketInterceptor) {
        return;
    }
    window.hasWebSocketInterceptor = true;

    // Save the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // MARK: class InterceptedWebSocket
    /**
     * A class that extends the original WebSocket class to intercept messages.
     */
    class InterceptedWebSocket extends OriginalWebSocket {
        // MARK: constructor
        /**
         * Creates an instance of InterceptedWebSocket.
         * @param {string | URL} url The URL to connect to.
         * @param {string | string[]} [protocols] The subprotocols to use.
         */
        constructor(url, protocols) {
            super(url, protocols);

            // Listen for incoming WebSocket messages and intercept the data.
            this.addEventListener("message", (event) => {
                window.postMessage({
                    type: "WEBSOCKET_MESSAGE",
                    data: event.data
                }, "*");
            });
        }

        // MARK: send
        /**
         * Overrides the send method to intercept outgoing messages.
         * @param {string | ArrayBuffer | Blob | ArrayBufferView} data The data to send.
         * @returns {void}
         */
        send(data) {
            // Intercept the outgoing message if the data is a Blob.
            if (data instanceof Uint8Array) {
                window.postMessage({
                    type: "WEBSOCKET_MESSAGE_OUTGOING",
                    data: Array.from(data)
                }, "*");
            }

            // Call the original send method
            super.send(data);
        }
    }

    // Assign the new class to window.WebSocket
    window.WebSocket = InterceptedWebSocket;
})();
