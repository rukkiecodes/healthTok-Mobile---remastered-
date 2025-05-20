interface MedicalExperienceLevel {
  id: number;
  name: string;
  description: string;
  years: string;
}

const medicalExperienceLevels: MedicalExperienceLevel[] = [
  {
    id: 1,
    name: 'Intern',
    description: 'Recently graduated, undergoing supervised clinical training.',
    years: '0-1 years'
  },
  {
    id: 2,
    name: 'Resident',
    description: 'In specialty training, working under supervision but with increased responsibility.',
    years: '1-3 years'
  },
  {
    id: 3,
    name: 'General Practitioner',
    description: 'Fully licensed doctor with independent practice experience.',
    years: '3-7 years'
  },
  {
    id: 4,
    name: 'Specialist',
    description: 'Has completed specialist training and is certified in a specific field.',
    years: '7-15 years'
  },
  {
    id: 5,
    name: 'Consultant',
    description: 'Senior specialist with extensive experience and leadership responsibilities.',
    years: '15+ years'
  }
];

export default medicalExperienceLevels;
