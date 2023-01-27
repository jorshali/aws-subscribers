export class Subscriber {
  subscriberId: string;
  createDate: number;
  updateDate: number;
  email: string;
  unsubscribeAll: boolean;

  constructor(data: any) {
    Object.assign(this, data);
  }
}