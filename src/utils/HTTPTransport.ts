export class HTTPTransport {
  public static readonly METHODS: Record<string, string> = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  };

  constructor() {
    this.request.bind(this);
  }

  public static queryStringify = (data: Record<string, any>) => {
    if (typeof data !== 'object') {
      throw new Error('Data must be object');
    }
    const keys: string[] = Object.keys(data);
    return keys.reduce(
      (result:string, key:string, index:number) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`,
      '?',
    );
  };

  get = (url: string, options: Record<string, any> = {}) => this
    .request(url, { ...options, method: HTTPTransport.METHODS.GET }, options.timeout);

  post = (url: string, options: Record<string, any> = {}) => this
    .request(url, { ...options, method: HTTPTransport.METHODS.POST }, options.timeout);

  put = (url: string, options: Record<string, any> = {}) => this
    .request(url, { ...options, method: HTTPTransport.METHODS.PUT }, options.timeout);

  delete = (url: string, options: Record<string, any> = {}) => this
    .request(url, { ...options, method: HTTPTransport.METHODS.DELETE }, options.timeout);

  request = (url: string, options: Record<string, any> = {}, timeout = 5000) => {
    const { headers, method, data } = options;
    return new Promise((resolve, reject) => {
      if (!method) {
        /* eslint-disable */
        reject('No method');
        /* eslint-enable */
        return;
      }
      const xhr = new XMLHttpRequest();
      const isGet = method === HTTPTransport.METHODS.GET;
      xhr.open(
        method,
        isGet && !!data
          ? `${url}${HTTPTransport.queryStringify(data)}`
          : url,
      );
      Object.keys(headers).forEach((key:string) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      /* eslint-disable */
      xhr.onload = function () {
        resolve(xhr);
      };
      /* eslint-enable */
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.timeout = timeout;
      xhr.ontimeout = reject;
      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
