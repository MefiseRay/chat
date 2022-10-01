import BaseAPI from "./BaseAPI";
import {ContentType} from "../utils/HTTPTransport";

export interface fileData {
  "id": string,
  "user_id": string,
  "path": string,
  "filename": string,
  "content_type": string,
  "content_size": number,
  "upload_date": string
}

export class ResourcesAPI extends BaseAPI {

  constructor() {
    super('/resource');
  }

  sendFile(data:FormData): Promise<fileData> {
    return this.http.post('/', data, ContentType.FormData);
  }
}
export default new ResourcesAPI();