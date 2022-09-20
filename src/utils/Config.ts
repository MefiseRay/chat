import * as dotenv from "dotenv";
dotenv.config();

const CONFIGURE = {
  PORT: Number(process.env.PORT) ?? 3000,
  API_URL: process.env.API_URL ?? ""
}
export default CONFIGURE;