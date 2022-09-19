type TListener = (...args: unknown[]) => void;

export class EventBus {
  private readonly listeners: Record<string, Array<(...args: TListener[]) => void>> = {};

  public on(event: string, callback: (...args: TListener[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: () => void): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  public emit(event: string, ...args: TListener[]) {
    if (!this.listeners[event]) {
      throw new Event(`Нет события: ${event}`);
    }
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
