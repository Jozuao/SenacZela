import React, { createContext, useContext, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { addMinutes } from 'date-fns';
import { Room, CleaningStatus, ScheduleItem, User } from '..';


type DataContextType = {
  rooms: Room[];
  schedules: ScheduleItem[];
  toggleRoomStatus: (roomId: string) => void;
  subscribeRoom: (roomId: string) => void;
  addRoom: (room: Omit<Room, 'id' | 'subscribers'>) => void;
  addSchedule: (s: Omit<ScheduleItem, 'id' | 'responsavelId'>) => void;
  user: User | null;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: React.ReactNode;
  initialUser: User | null; // pass current user here
  initialRooms?: Room[];
  initialSchedules?: ScheduleItem[];
};

export const DataProvider = ({
  children,
  initialUser,
  initialRooms = [],
  initialSchedules = [],
}: DataProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);

  const notifyRoomChange = (room: Room) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: `Sala ${room.numero} atualizada`,
        body: `Status alterado para ${room.status}`,
      },
      trigger: null, // immediate notification
    });
  };

  const toggleRoomStatus = (roomId: string) => {
    setRooms(prev =>
      prev.map(r =>
        r.id === roomId
          ? {
              ...r,
              status: r.status === 'limpo' ? ('pendente' as CleaningStatus) : ('limpo' as CleaningStatus),
            }
          : r
      )
    );

    const room = rooms.find(r => r.id === roomId);
    if (room) notifyRoomChange(room);
  };

  const subscribeRoom = (roomId: string) => {
    if (!user) return;
    setRooms(prev =>
      prev.map(r =>
        r.id === roomId
          ? {
              ...r,
              subscribers: r.subscribers.includes(user.id)
                ? r.subscribers.filter(id => id !== user.id)
                : [...r.subscribers, user.id],
            }
          : r
      )
    );
  };

  const addRoom = (room: Omit<Room, 'id' | 'subscribers'>) => {
    setRooms(prev => [...prev, { ...room, id: String(prev.length + 1), subscribers: [] }]);
  };

  const addSchedule = (s: Omit<ScheduleItem, 'id' | 'responsavelId'>) => {
    if (!user) return;
    const newItem: ScheduleItem = { ...s, id: String(schedules.length + 1), responsavelId: user.id };
    setSchedules(prev => [...prev, newItem]);

    const roomNumber = rooms.find(r => r.id === newItem.salaId)?.numero;

    // Alert 10 minutes before start time
    const triggerDate = addMinutes(new Date(s.inicioISO), -10);
    if (triggerDate > new Date()) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de agendamento',
          body: `${newItem.titulo} na sala ${roomNumber}`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate.getTime(), // <-- converte Date para número
        },
      });
    }
  };

  const value = useMemo(
    () => ({ rooms, schedules, toggleRoomStatus, subscribeRoom, addRoom, addSchedule, user }),
    [rooms, schedules, user]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
