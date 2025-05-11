type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export const calculateAge = (timestamp: FirebaseTimestamp): number => {
  if (!timestamp || typeof timestamp.seconds !== 'number') return 0;

  const birthDate = new Date(timestamp.seconds * 1000);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
