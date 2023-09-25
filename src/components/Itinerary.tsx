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
import Placeholder from './cards/Placeholder';
import { createNewCards } from '../utils/cardUtils';
import { useContext } from 'react';
import { UserContext } from '../utils/UserProvider';
import { UserData } from '../types';
import { useParams } from 'react-router-dom';

/* 
TODO: [] Populate the itinerary from the database 
TODO: [] Wherever cards is set, update the itinerary with those cards in the order
*/

const CardType = {
  Card: 'Card',
};

function Itinerary(): JSX.Element {
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const contextValue = useContext(UserContext) as {
    user: UserData;
    updateUser: (userData: UserData) => void;
  };

  const { user: userData } = contextValue;
  const { itineraryID } = useParams();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: CardType.Card,
      drop: async (item: { name: string; id: string }, monitor) => {
        // Only update state here if it's the first component to be dropped. Otherwise, the placeholder handles this logic.
        if (monitor.didDrop()) return true;
        const newCard: JSX.Element = await createNewCards(
          item,
          itineraryID,
          setCards
        );
        setCards((prevState) => {
          if (prevState.length === 0) {
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
