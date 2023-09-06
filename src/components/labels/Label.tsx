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
import { Card } from 'antd';

const CardType = {
  Card: 'Card',
};

function CardLabels({ name, icon, color }: CardLabelTypes): JSX.Element {
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
      } text-xl font-bold cursor-move m-2 flex items-center`}
    >
      <Card
        className='w-full border border-solid border-1 shadow-sm '
        title={
          <div
            className={`w-11 h-11 ${color} rounded-full flex items-center justify-center shadow-sm`}
          >
            {icon}
          </div>
        }
        bordered={true}
      >
        {name}
      </Card>
    </div>
  );
}

export default CardLabels;
