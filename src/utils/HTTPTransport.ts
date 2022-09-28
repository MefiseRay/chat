export enum Method {
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Patch = 'Patch',
  Delete = 'Delete'
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data'
}

type Options = {
  method: Method;
  type: ContentType;
  data?: any;
};

export default class HTTPTransport {
  static API_URL = "https://ya-praktikum.tech/api/v2";

  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
  }

  public get<Response>(path = '/', data?: unknown,  type:ContentType = ContentType.Json): Promise<Response> {
    return this.request<Response>(this.endpoint + path, {
      method: Method.Get,
      data,
      type
    });
  }

  public post<Response = void>(path: string, data?: unknown, type:ContentType = ContentType.Json): Promise<Response> {
    return this.request<Response>(this.endpoint + path, {
      method: Method.Post,
      data,
      type
    });
  }

  public put<Response = void>(path: string, data: unknown, type:ContentType = ContentType.Json): Promise<Response> {
    return this.request<Response>(this.endpoint + path, {
      method: Method.Put,
      data,
      type
    });
  }

  public patch<Response = void>(path: string, data: unknown, type:ContentType = ContentType.Json): Promise<Response> {
    return this.request<Response>(this.endpoint + path, {
      method: Method.Patch,
      data,
      type
    });
  }

  public delete<Response>(path: string, data?: unknown, type:ContentType = ContentType.Json): Promise<Response> {
    return this.request<Response>(this.endpoint + path, {
      method: Method.Delete,
      data,
      type
    });
  }

  public static getFile(path: string):string {
    return `${HTTPTransport.API_URL}/resources${path}`;
  }

  private request<Response>(
    url: string,
    options: Options = { method: Method.Get, type: ContentType.Json },
  ): Promise<Response> {
    const { method, data, type } = options;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.onabort = () => reject({ reason: 'abort' });
      xhr.onerror = () => reject({ reason: 'network error' });
      xhr.ontimeout = () => reject({ reason: 'timeout' });
      if(type !== ContentType.FormData) {
        xhr.setRequestHeader('Content-Type', type);
      }
      xhr.withCredentials = true;
      xhr.responseType = 'json';
      if (method === Method.Get || !data) {
        xhr.send();
      } else if(type === ContentType.Json) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data);
      }
    });
  }
}
