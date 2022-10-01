import BaseAPI from './BaseAPI';
import HTTPTransport, { ContentType } from '../utils/HTTPTransport';

export interface fileData {
  'id': string,
  'user_id': string,
  'path': string,
  'filename': string,
  'content_type': string,
  'content_size': number,
  'upload_date': string
}

export class ResourcesAPI extends BaseAPI {
  constructor() {
    super('/resources');
  }

  sendFile(data:FormData): Promise<fileData> {
    return this.http.post('/', data, ContentType.FormData);
  }

  getFile(path:string):string {
    return HTTPTransport.getFile(path);
  }
}
export default new ResourcesAPI();
