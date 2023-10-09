import { Dayjs } from 'dayjs';

export interface CardLabelTypes {
  name: string;
  icon: React.ReactNode;
  color: string;
}

export interface UserData {
  _id: string;
  email: string;
  startData: string;
  username: string;
}

export const CardType = {
  Card: 'Card',
};

export interface TimeData {
  value: Dayjs | null;
  dateString: string;
}

export interface FormItem {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface CardProps {
  name: string;
  id: null | string;
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

export interface CardObj {
  type: string;
  id: string;
}
