export interface Profile {
  uid: string;
  photoURL?: string;
  name?: string;
  username?: string;
  email?: string;
  gender?: string;
  referralCode?: string;
  displayImage?: {
    image: string,
    path: string
  };
  profilePicture?: string
  specialization?: string
  accountType: string
}