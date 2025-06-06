export interface ProfileState {
  profile: Profile | null;
  setupTab: string
  modal: boolean
}
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
  address?: string
  coords?: {
    latitude?: number | any
    longitude?: number | any
  }
  birth?: any
  allergies?: any[] | any
}