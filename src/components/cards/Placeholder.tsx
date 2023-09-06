/**
 * **************************************************
 *
 * @description
 * This component renders the invisible card.
 *
 * **************************************************
 */

import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { createNewCards, zipCards } from '../../utils/cardUtils';

const CardType = {
  Card: 'Card',
};

interface PlaceholderProps {
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  id: string;
}

function Placeholder({ setCards, id }: PlaceholderProps): JSX.Element {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: CardType.Card,
      drop: (item: { name: string; id: string }) => {
        // If the item id is undefined, we know it's a new card that's been dropped.
        if (!item.id) {
          setCards((prevState) => {
            const allCards = [];
            for (let i = 0; i < prevState.length; i++) {
              if (prevState[i].props.id === id) {
                const newCard: JSX.Element = createNewCards(item);
                allCards.push(newCard);
              } else {
                allCards.push(prevState[i]);
              }
            }

            const cards = zipCards(allCards, setCards);

            return [
              ...cards.flat(),
              <Placeholder setCards={setCards} id={uuidv4()} />,
            ];
          });
        }
        // Otherwise it's an existing card that needs to be rearranged.
        else {
          setCards((prevState) => {
            // Grab the card info that needs to be moved
            const itemCard = prevState.filter((card) => {
              return card.props.id === item.id;
            });

            // Grab the index of the card that needs to be moved
            const oldIndex = prevState.findIndex((card) => {
              return card.props.id === item.id;
            });

            // Grab the index where it needs to be dropped
            const newIndex = prevState.findIndex((card) => {
              return card.props.id === id;
            });

            // Remove the card from the list and replace the placeholder with the new item.
            const newCards = [];
            for (let i = 0; i < prevState.length; i++) {
              if (i === newIndex) {
                newCards.push(itemCard[0]);
              }
              if (i === oldIndex) {
                continue;
              } else {
                newCards.push(prevState[i]);
              }
            }

            // Remove all the placeholders and regenerate
            const cards = zipCards(newCards, setCards);
            return [
              ...cards.flat(),
              <Placeholder setCards={setCards} id={uuidv4()} />,
            ];
          });
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div
      id={id}
      className={
        isOver
          ? 'animate-pulse border-dotted border-2 border-indigo-300 h-[120px] m-2 bg-stone-100 text-center flex justify-center items-center'
          : 'h-[5px] m-2'
      }
      ref={drop}
    >
      {isOver ? 'Drop here!' : ''}
    </div>
  );
}

export default Placeholder;
