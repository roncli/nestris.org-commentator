(() => {
    if (window.interceptInjected) {
        return;
    }
    window.interceptInjected = true;

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    (document.head || document.documentElement).prepend(script);
    script.remove();

    window.addEventListener("message", (event) => {
        if (event.source !== window || !event.data) {
            return;
        }

        switch (event.data.type) {
            case "WEBSOCKET_MESSAGE": {
                const {data} = event.data;

                if (data instanceof Blob) {
                    // Convert Blob to ArrayBuffer asynchronously
                    data.arrayBuffer().then((arrayBuffer) => {
                        chrome.runtime.sendMessage({
                            action: "websocketBlob",
                            data: Array.from(new Uint8Array(arrayBuffer))
                        });
                    }).catch((error) => {
                        console.error("Failed to convert Blob to ArrayBuffer:", error);
                    });
                } else {
                    // Send non-Blob data synchronously
                    chrome.runtime.sendMessage({
                        action: "websocketMessage",
                        data
                    });
                }

                break;
            }
            case "WEBSOCKET_MESSAGE_OUTGOING": {
                const {data} = event.data;

                // Convert Blob to ArrayBuffer asynchronously
                chrome.runtime.sendMessage({
                    action: "websocketOutboundBlob",
                    data
                });

                break;
            }
        }
    });
})();
