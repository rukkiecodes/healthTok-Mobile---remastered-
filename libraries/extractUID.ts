export const getOtherParticipant = (participants: string[] | any, currentUid: string): string | any => {
  return participants.find((uid: any) => uid !== currentUid) || null;
};