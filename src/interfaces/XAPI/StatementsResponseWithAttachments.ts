import { Part } from "../Statement";
import { StatementsResponse } from "./StatementsResponse";

export type StatementsResponseWithAttachments = [StatementsResponse, ...Part[]];
