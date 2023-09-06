/**
 * **************************************************
 *
 * @description
 * This file stores all the utils for the cards.
 *
 * **************************************************
 */

import FlightCard from '../components/cards/FlightCard';
import HotelCard from '../components/cards/HotelCard';
import RestaurantCard from '../components/cards/RestaurantCard';
import ActivityCard from '../components/cards/ActivityCard';
import Placeholder from '../components/cards/Placeholder';
import DateCard from '../components/cards/DateCard';

import { v4 as uuidv4 } from 'uuid';

// Converts the timestamp to the correct format
export function convertTo12HourFormat(timestamp: string) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}

// Creates new cards when dropped
export function createNewCards(item: { name: string; id?: string }) {
  switch (item.name) {
    case 'Flight Card':
      return <FlightCard name='Flight Card' id={uuidv4()} />;
    case 'Hotel Card':
      return <HotelCard name='Hotel Card' id={uuidv4()} />;
    case 'Restaurant Card':
      return <RestaurantCard name='Restaurant Card' id={uuidv4()} />;
    case 'Activity Card':
      return <ActivityCard name='Activity Card' id={uuidv4()} />;
    case 'Date Card':
      return <DateCard name='Date Card' id={uuidv4()} />;
    default:
      return <div>A broken div, I see!</div>;
  }
}

// Handles the rearranging of cards and creation of placeholders in the appropriate places
export function zipCards(
  cards: JSX.Element[],
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) {
  const noPlaceholders = cards.filter((card) => {
    return card.props.name;
  });

  const result: JSX.Element[] = noPlaceholders.reduce(
    (acc: JSX.Element[], card: JSX.Element) => {
      acc.push(<Placeholder setCards={setCards} id={uuidv4()} />);
      acc.push(card);
      return acc;
    },
    []
  );
  return result;
}

// Formats the date
export function formatDate(inputDate: string) {
  const dateObj = new Date(inputDate);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const day = dayNames[dateObj.getDay()];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  const dayOfMonth = dateObj.getDate();
  return `${day}, ${month} ${dayOfMonth}, ${year}`;
}
