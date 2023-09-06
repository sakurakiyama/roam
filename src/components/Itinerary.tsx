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
import Placeholder from './cards/Placeholder';
import { createNewCards } from '../utils/cardUtils';

const CardType = {
  Card: 'Card',
};

function Itinerary(): JSX.Element {
  const [cards, setCards] = useState<JSX.Element[]>([]);

  const [, drop] = useDrop(
    () => ({
      accept: CardType.Card,
      drop: (item: { name: string; id: string }) => {
        setCards((prevState) => {
          if (prevState.length === 0) {
            const newCard: JSX.Element = createNewCards(item);
            return [
              <Placeholder setCards={setCards} id={uuidv4()} />,
              newCard,
              <Placeholder setCards={setCards} id={uuidv4()} />,
            ];
          }
          return prevState;
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div
      className='border-solid shadow-md mt-4 h-[85vh] overflow-y-auto'
      ref={drop}
    >
      <div>
        {cards.map((card) => {
          return <div key={card.props.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}

export default Itinerary;
