interface ArtisanExperienceLevel {
  id: number;
  name: string;
  description: string;
  years: string;
}

const artisanExperienceLevels: ArtisanExperienceLevel[] = [
  { id: 1, name: 'Beginner', description: 'Just starting out, learning the basics.', years: '0-1 years' },
  { id: 2, name: 'Intermediate', description: 'Has some experience, can handle common tasks.', years: '1-3 years' },
  { id: 3, name: 'Advanced', description: 'Experienced, capable of complex tasks and projects.', years: '3-5 years' },
  { id: 4, name: 'Expert', description: 'Highly skilled, recognized as a master in the field.', years: '5-10 years' },
  { id: 5, name: 'Master', description: 'A true master, with extensive experience and recognition.', years: '10+ years' }
];

export default artisanExperienceLevels;
