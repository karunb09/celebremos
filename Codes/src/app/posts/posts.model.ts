import { Time } from "@angular/common";

export interface Post {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  host: string;
  location: string;
  street: string;
  city: string;
  state: string;
  content: string;
  guests: [string];
  responses: {
    accepted: [string];
    denied: [string];
    ambiguous: [string];
  };
}
