export class HTTPTransport {

    constructor () {
        this.METHODS = {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
        };
        this.request.bind(this);
    }

    queryStringify = (data: Object) => {
        if (typeof data !== 'object') {
            throw new Error('Data must be object');
        }

        // Здесь достаточно и [object Object] для объекта
        const keys = Object.keys(data);
        return keys.reduce((result, key, index) => {
            return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
        }, '?');
    }

    get = (url: string, options = {}) => {

        return this.request(url, {...options, method: this.METHODS.GET}, options.timeout);
    };

    post = (url: string, options = {}) => {
        return this.request(url, {...options, method: this.METHODS.POST}, options.timeout);
    };

    put = (url: string, options = {}) => {
        return this.request(url, {...options, method: this.METHODS.PUT}, options.timeout);
    };

    delete = (url: string, options = {}) => {
        return this.request(url, {...options, method: this.METHODS.DELETE}, options.timeout);
    };

    request = (url: string, options = {}, timeout = 5000) => {
        const {headers: Object = {}, method, data} = options;

        return new Promise(function(resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === this.METHODS.GET;

            xhr.open(
                method,
                isGet && !!data
                    ? `${url}${this.queryStringify(data)}`
                    : url,
            );

            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function() {
                resolve(xhr);
            };

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