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
  isApplicationSubmited?: boolean
  phone?: string
  birth?: any
  price?: string
  coords?: {
    latitude?: number
    longitude?: number
  }
  expoPushNotificationToken?: any
}