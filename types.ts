export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isError?: boolean;
}

export interface Conversation {
  id:string;
  title: string;
  messages: Message[];
}