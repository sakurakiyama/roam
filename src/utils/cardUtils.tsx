import FlightCard from '../components/cards/FlightCard';
import HotelCard from '../components/cards/HotelCard';
import RestaurantCard from '../components/cards/RestaurantCard';
import Placeholder from '../components/cards/Placeholder';

import { v4 as uuidv4 } from 'uuid';

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

export function createNewCards(item: { name: string; id?: string }) {
  switch (item.name) {
    case 'Flight Card':
      return <FlightCard name='Flight Card' id={uuidv4()} />;
    case 'Hotel Card':
      return <HotelCard name='Hotel Card' id={uuidv4()} />;
    case 'Restaurant Card':
      return <RestaurantCard name='Restaurant Card' id={uuidv4()} />;
    default:
      return <div>A broken div, I see!</div>;
  }
}

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
