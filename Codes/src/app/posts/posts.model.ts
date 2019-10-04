import { Time } from "@angular/common";

export interface Post {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  host: string;
  location: string;
  content: string;
  guests: [string];
  accepted: [string];
  denied: [string];
  ambiguous: [string];
}
