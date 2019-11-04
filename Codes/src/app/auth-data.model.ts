export interface AuthData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phonenumber: string;
  activationStatus: boolean;
  createdEvents: [string];
  contacts: [ {
    firstname: string;
    lastname: string;
    mobilenumber: string;
    emailid: string;
  }];
}
