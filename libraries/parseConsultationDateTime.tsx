import { db } from '@/utils/fb';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const parseConsultationDateTime = (dateObj: any, timeObj: any): Date => {
  const { day, month, year } = dateObj;
  const { time } = timeObj;

  const monthIndex = monthNames.indexOf(month);
  const [hourMin, period] = time.split(' ');
  let [hour, minute] = hourMin.split(':').map(Number);

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return new Date(Number(year), monthIndex, Number(day), hour, minute || 0);
};

export const useConsultationTimer = (appointment: any, chatId: string) => {
  useEffect(() => {
    if (!appointment?.selectedDate || !appointment?.selectedTime) return;

    const interval = setInterval(() => {
      const consultDateTime = parseConsultationDateTime(
        appointment.selectedDate,
        appointment.selectedTime
      );

      const now = new Date();
      const oneHourAfter = new Date(consultDateTime.getTime() + 60 * 60 * 1000);

      if (now >= oneHourAfter) {
        Alert.alert(
          "Consultation Ended",
          "The consultation time is over.",
          [
            {
              text: "OK",
              onPress: async () => {
                await updateDoc(doc(db, 'chats', String(chatId)), {
                  isConsultionOpen: false,
                });
              }
            }
          ]
        );
        clearInterval(interval); // stop further checks
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [appointment, chatId]);
};
