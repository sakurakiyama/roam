/**
 * **************************************************
 *
 * @description
 * This component renders the draggable flight card.
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
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
        background: 'pink',
        margin: '5px',
      }}
    >
      {name}
    </div>
  );
}

export default RestaurantCard;
