export enum MomentType {
  Text = 'text',
}

export type Moment = {
  id: string;
  avatar: string;
  text: string;
  type: MomentType;
  createdAt: Date;
}