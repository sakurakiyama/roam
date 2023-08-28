/**
 * **************************************************
 *
 * @description
 * This component renders the draggable hotel card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
const CardType = {
  Card: 'Card',
};

interface HotelCardProps {
  name: string;
  id: null | string;
}

function HotelCard({ name, id }: HotelCardProps): JSX.Element {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move bg-yellow-300 m-2 flex items-center`}
    >
      {name}
    </div>
  );
}

export default HotelCard;
