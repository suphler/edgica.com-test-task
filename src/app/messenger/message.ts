export class Message {

  id: number;
  header: string;
  body: string;
  keywords: any[string];
  data: number;

  constructor(id: number, h: string, b: string, k: any[], d: number) {
    this.id = id;
    this.header = h;
    this.body = b;
    this.keywords = k;
    this.data = d;
  }
}
