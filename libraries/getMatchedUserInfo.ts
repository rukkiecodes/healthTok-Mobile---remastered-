interface User {
  [key: string]: any; // Replace `any` with the actual user properties type
}

type Users = Record<string, User>;

const getUserData = (users: Users, userLoggedIn: string): { id: string; user: User } | null => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];

  const entries = Object.entries(newUsers);

  if (entries.length === 0) {
    return null; // or handle accordingly
  }

  const [id, user] = entries[0];

  return { id, ...user };
}

export default getUserData;
