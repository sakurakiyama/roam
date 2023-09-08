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
import { CardProps, CardType } from '../../types';

interface DateCardData {
  date: Dayjs | null;
  dateString: string;
  formattedDate: string;
}

function DateCard({ name, id }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<DateCardData | undefined>(undefined);

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
      } text-xl font-bold cursor-move mx-2 flex items-center `}
    >
      {/* If the card data is generated, show the collapsable component */}
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full bg-white'
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: <p>{cardData.formattedDate}</p>,
              children: (
                <DatePicker
                  defaultValue={cardData.date || new Dayjs()}
                  onChange={onChange}
                />
              ),
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4 bg-white'>
          <DatePicker onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export default DateCard;
