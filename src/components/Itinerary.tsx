/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This component renders the itinerary
 *
 * **************************************************
 */
import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FlightCard from './cards/FlightCard';
import HotelCard from './cards/HotelCard';
import RestaurantCard from './cards/RestaurantCard';

const CardType = {
  Card: 'Card',
};

function Itinerary(): JSX.Element {
  const [cards, setCards] = useState<JSX.Element[]>([]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: CardType.Card,
      drop: (item: JSX.Element) => {
        const newId = uuidv4();
        let newCard: JSX.Element;
        switch (item.name) {
          case 'Flight Card':
            newCard = <FlightCard name='Flight Card' id={newId} />;
            break;
          case 'Hotel Card':
            newCard = <HotelCard name='Hotel Card' id={newId} />;
            break;
          case 'Restaurant Card':
            newCard = <RestaurantCard name='Restaurant Card' id={newId} />;
            break;
          default:
            break;
        }

        setCards((prevState) => {
          return [...prevState, newCard];
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div className='border-solid border-2 h-[500px]' ref={drop}>
      {/* <div className='bg-blue-200 h-[50%]' ref={drop}></div> */}
      <div>
        {cards.map((card) => {
          return <div key={card.props.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}

export default Itinerary;
