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

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: CardType.Card,
      drop: (item: { name: string; id: string }) => {
        // Only update state here if it's the first component to be dropped. Otherwise, the placeholder handles this logic.
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
      className={
        isOver && cards.length === 0
          ? 'animate-pulse border-dotted border-2 border-indigo-300 h-[85vh] m-2 bg-stone-100 text-center flex justify-center items-center'
          : 'border-solid shadow-md mt-4 h-[85vh] overflow-y-auto'
      }
      ref={drop}
    >
      {isOver && cards.length === 0 ? 'Drop here!' : ''}
      <div>
        {cards.map((card) => {
          return <div key={card.props.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}

export default Itinerary;
