/**
 * **************************************************
 *
 * @description
 * This component renders each label
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { CardLabelTypes } from '../../types';

const CardType = {
  Card: 'Card',
};

function CardLabels({ name, icon }: CardLabelTypes): JSX.Element {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move bg-stone-300 m-2 flex items-center`}
    >
      <div className='mr-2'>{icon}</div>
      <div>{name}</div>
    </div>
  );
}

export default CardLabels;
