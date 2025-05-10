export interface Doctor {
  uid?: string
  displayImage?: {
    image?: string
  }
  profilePicture?: string
  name?: string
  specialization?: string
  coords?: {
    latitude?: number
    longitude?: number
  }
}