export interface Post {
  id: string;
  title: string;
  type: string;
  imagePath: string;
  date: string;
  time: string;
  host: string;
  location: string;
  content: string;
  guests: [string];
}
