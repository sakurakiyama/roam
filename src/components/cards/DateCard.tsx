/**
 * **************************************************
 *
 * @description
 * This component renders the draggable date card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';

import { DatePicker, Collapse } from 'antd';
import { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';
import { formatDate } from '../../utils/cardUtils';

const CardType = {
  Card: 'Card',
};

interface ActivityCardProps {
  name: string;
  id: null | string;
}

interface CardData {
  date: Dayjs | null;
  dateString: string;
  formattedDate: string;
}

function DateCard({ name, id }: ActivityCardProps): JSX.Element {
  const [cardData, setCardData] = useState<CardData | undefined>(undefined);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    const formattedDate = formatDate(dateString);
    setCardData({ date, dateString, formattedDate });
  };

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
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex items-center`}
    >
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full'
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: <p>{cardData.formattedDate}</p>,
              children: <DatePicker onChange={onChange} />,
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4'>
          <DatePicker onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export default DateCard;
