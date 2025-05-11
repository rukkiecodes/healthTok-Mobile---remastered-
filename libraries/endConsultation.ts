import { db } from '@/utils/fb';
import { updateDoc, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const parseConsultationDateTime = (dateObj: any, timeObj: any): Date => {
  const { day, month, year } = dateObj;
  const { time } = timeObj;

  const monthIndex = monthNames.indexOf(month); // e.g. May -> 4
  const [hourMin, period] = time.split(' ');
  let [hour, minute] = hourMin.split(':').map(Number);

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  const fullDate = new Date(Number(year), monthIndex, Number(day), hour, minute || 0);
  return fullDate;
};

export const checkAndEndConsultation = async (chatId: string, appointment: any, patient: string, doctor: string, appointmentId: string, appointmentData: any) => {
  if (!appointment?.selectedDate || !appointment?.selectedTime) return;

  const consultDateTime = parseConsultationDateTime(
    appointment.selectedDate,
    appointment.selectedTime
  );

  const now = new Date();
  const oneHourAfterConsult = new Date(consultDateTime.getTime() + 60 * 60 * 1000);

  if (now >= oneHourAfterConsult) {
    console.log('Ending consultation...');
    await updateDoc(doc(db, 'chats', String(chatId)), {
      isConsultionOpen: false,
    });
    clearCollections(patient, doctor, appointmentId, appointmentData)
  } else {
    alert('Consultation is still within the valid time window.');
  }
};

// TODO: Test this block
const clearCollections = async (patient: string, doctor: string, appointment: string, appointmentData: any) => {
  await setDoc(doc(db, 'doctors', doctor, 'completed_appointments', appointment), {
    appointmentData,
    completedAt: serverTimestamp()
  })

  await setDoc(doc(db, 'patient', patient, 'completed_appointments', appointment), {
    appointmentData,
    completedAt: serverTimestamp()
  })

  await deleteDoc(doc(db, 'doctors', doctor, 'appointments', appointment))
  await deleteDoc(doc(db, 'patient', patient, 'appointments', appointment))
}