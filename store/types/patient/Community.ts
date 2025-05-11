export interface communityState { }

export interface community { 
  id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  members: string[];
  createdAt?: any;
  [key: string]: any;
}