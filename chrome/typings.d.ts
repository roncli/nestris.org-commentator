interface Window {
    commentator: Commentator | null;
    hasWebSocketInterceptor: boolean;
    interceptInjected: boolean;
}

declare class Commentator {
    static startup(): Promise<void>;

    reset(): void;
}
