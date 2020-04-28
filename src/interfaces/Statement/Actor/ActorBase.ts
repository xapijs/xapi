export interface ActorBase {
  name?: string;
  mbox?: string;
  mbox_sha1sum?: string;
  account?: {
    homePage?: string;
    name?: string;
  };
  openid?: string;
}
