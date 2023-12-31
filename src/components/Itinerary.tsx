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
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Placeholder from './cards/Placeholder';
import { createNewCards } from '../utils/cardUtils';
import { useContext } from 'react';
import { UserContext } from '../utils/UserProvider';
import { UserData, CardObj } from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { renderCards } from '../utils/cardUtils';

const CardType = {
  Card: 'Card',
};

interface StoredCards {
  type: string;
  id: string;
}

interface ItineraryProps {
  cardArray: CardObj[];
}
function Itinerary({ cardArray }: ItineraryProps): JSX.Element {
  const [cards, setCards] = useState<JSX.Element[]>([]);

  const contextValue = useContext(UserContext) as {
    user: UserData;
    updateUser: (userData: UserData) => void;
  };

  useEffect(() => {
    if (cardArray.length) {
      renderCards(cardArray, setCards);
    }
  }, [cardArray]);

  useEffect(() => {
    const updateCards = async () => {
      try {
        if (cards.length) {
          const allCards: StoredCards[] = [];
          cards.forEach((card) => {
            if (card.props.name) {
              allCards.push({ type: card.props.name, id: card.props.id });
            }
          });
          await axios.patch('/user/updateItineraryCards', {
            cards: allCards,
            id: itineraryID,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateCards();
  }, [cards]);

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
