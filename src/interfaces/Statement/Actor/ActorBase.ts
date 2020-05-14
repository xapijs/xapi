import { Account } from "./Account";

export interface ActorBase {
  name?: string;
  mbox?: string;
  mbox_sha1sum?: string;
  account?: Account;
  openid?: string;
}
