import { Account } from "./Account";

export interface InverseFunctionalIdentifier {
  mbox?: string;
  mbox_sha1sum?: string;
  account?: Account;
  openid?: string;
}
