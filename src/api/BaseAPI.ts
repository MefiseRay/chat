import HTTPTransport from '../utils/HTTPTransport';

export default abstract class BaseAPI {
  protected http: HTTPTransport;

  protected constructor(endpoint: string) {
    this.http = new HTTPTransport(endpoint);
  }
}

export interface BaseCreateAPI {
  create(data: unknown): Promise<unknown>;
}

export interface BaseReadAPI {
  read(identifier?: string): Promise<unknown>;
}

export interface BaseUpdateAPI {
  update(identifier: string, data: unknown): Promise<unknown>;
}

export interface BaseDeleteAPI {
  delete(identifier: string): Promise<unknown>;
}