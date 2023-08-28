/**
 * **************************************************
 *
 * @description
 * This component renders the draggable restaurant card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';

const CardType = {
  Card: 'Card',
};

interface RestaurantCardProps {
  name: string;
  id: null | string;
}

function RestaurantCard({ name, id }: RestaurantCardProps): JSX.Element {
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
      } text-xl font-bold cursor-move bg-pink-300 m-2 flex items-center`}
    >
      {name}
    </div>
  );
}

export default RestaurantCard;
