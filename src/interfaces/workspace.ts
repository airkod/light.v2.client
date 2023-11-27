import { Body } from "./body";

export interface Workspace {
  meta?: {
    collection?: string;
    apiKey?: string;
    accessToken?: string;
  };
  body?: Body | {
    login?: string;
    password?: string;
  };
}
