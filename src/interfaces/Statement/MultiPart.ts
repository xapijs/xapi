export interface MultiPart {
  header: { "Content-Type": string };
  blob: Blob;
}
