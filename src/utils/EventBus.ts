export class EventBus {

    private readonly listeners: Record<string, Array<(...args: any[]) => void>> = {};

    public on(event: string, callback: (...args: any[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public off(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    public emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) {
            throw new Event(`Нет события: ${event}`);
        }
        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }
}