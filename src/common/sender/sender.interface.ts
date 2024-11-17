export interface Sender {
  send(receiveId: string, message: string): Promise<boolean>;
}
