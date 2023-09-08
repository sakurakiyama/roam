import { GoTrash } from 'react-icons/go';
import { zipCards } from '../../utils/cardUtils';
import Placeholder from '../cards/Placeholder';
import { v4 as uuidv4 } from 'uuid';

interface TrashProps {
  id: string | null;
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

function Trash({ id, setCards }: TrashProps) {
  const deleteCard = () => {
    setCards((prevState) => {
      const index = prevState.findIndex((card) => {
        return card.props.id === id;
      });
      const newCards = [];
      for (let i = 0; i < prevState.length; i++) {
        if (i === index) continue;
        else {
          newCards.push(prevState[i]);
        }
      }

      const cards = zipCards(newCards, setCards);
      return [
        ...cards.flat(),
        <Placeholder setCards={setCards} id={uuidv4()} />,
      ];
    });
  };
  return (
    <div>
      <button onClick={deleteCard}>
        <GoTrash />
      </button>
    </div>
  );
}

export default Trash;
