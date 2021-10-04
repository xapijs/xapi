import { Part } from "..";
import { StatementsResponse } from ".";

export type StatementsResponseWithAttachments = [StatementsResponse, ...Part[]];
