/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useState, useEffect } from 'react';
import type { DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { formatDate } from '../../utils/cardUtils';
import { CardType, CardProps } from '../../types';
import Trash from '../shared/Trash';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DateCardData {
  date: Dayjs | null;
  dateString: string;
  formattedDate: string;
}

function DateCard({ name, id, setCards }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<DateCardData | undefined>(undefined);

  ('2023-10-13T15:35:01.816Z');
  useEffect(() => {
    const getCardDetails = async () => {
      const { data: cardDetails } = await axios.get(
        `/user/getCardDetails/${id}/${name}`
      );
      const details: DateCardData = {
        date: dayjs(cardDetails.date) || null,
        dateString: cardDetails.dateString || '',
        formattedDate: cardDetails.formattedDate || '',
      };
      setCardData(details);
    };
    getCardDetails();
  }, [id, name]);

  const onChange: DatePickerProps['onChange'] = async (date, dateString) => {
    const formattedDate = formatDate(dateString);
    const { data: updatedCard } = await axios.patch('/user/updateCard', {
      id,
      type: name,
      date,
      dateString,
      formattedDate,
    });

    // TODO: [] Update the interface to reflect the returned object and use said object to update state
    setCardData({ date, dateString, formattedDate });
    toast('✅ Saved successfully.');
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
      } text-xl font-bold cursor-move mx-2 flex items-center space-x-4 `}
    >
      {/* If the card data is generated, show the collapsable component */}
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full bg-white'
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
      <Trash id={id} setCards={setCards} />
    </div>
  );
}

export default DateCard;
