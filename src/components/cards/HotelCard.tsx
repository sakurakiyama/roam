/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This component renders the draggable hotel card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Button, TimePicker } from 'antd';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { renderFormItems, handleTimeChange } from '../../utils/cardUtils';
import { CardType, TimeData, FormItem, CardProps } from '../../types';
import Trash from '../shared/Trash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
/*
TODO: [] Use API to generate fields
TODO: [x] Format inputted times
TODO: [] Add icon or flexibility of choosing an icon 
TODO: [] Add whether the booking is confirmed or pending 
*/

interface HotelCardData {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelConfirmationNumber: string;
  hotelNotes: string;
}

interface HotelFormValues {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelConfirmationNumber: string;
  hotelNotes: string;
}

function HotelCard({ name, id, setCards }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<HotelCardData | undefined>(
    undefined
  );
  const [time, setTime] = useState<TimeData | undefined>(undefined);
  const [timeError, setTimeError] = useState<string>('');
  const [form] = Form.useForm();
  const format = 'hh:mm A';

  useEffect(() => {
    const getCardDetails = async () => {
      const { data: cardDetails } = await axios.get(
        `/user/getCardDetails/${id}/${name}`
      );

      const details: HotelCardData = {
        hotelName: cardDetails.hotelName || '',
        hotelAddress: cardDetails.hotelAddress || '',
        hotelPhone: cardDetails.hotelPhone || '',
        hotelConfirmationNumber: cardDetails.hotelConfirmationNumber || '',
        hotelNotes: cardDetails.hotelNotes || '',
      };
      setCardData(details);
      setTime({
        value: null,
        dateString: cardDetails.hotelArrivalTime || '',
      });
    };
    getCardDetails();
  }, [id, name]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Handles form submission
  const handleFormSubmit = async (values: HotelFormValues) => {
    if (!time?.dateString) {
      setTimeError('Please enter an arrival time');
      return;
    }
    setTimeError('');
    try {
      const {
        hotelName,
        hotelAddress,
        hotelPhone,
        hotelConfirmationNumber,
        hotelNotes,
      } = values;

      const hotelCardData = {
        hotelName,
        hotelAddress,
        hotelPhone,
        hotelConfirmationNumber,
        hotelNotes,
      };

      const { data: updatedCard } = await axios.patch('/user/updateCard', {
        id,
        type: name,
        hotelArrivalTime: time.dateString,
        ...hotelCardData,
      });

      // TODO: [] Update the interface to reflect the returned object and use said object to update state

      setCardData(hotelCardData);
      toast('✅ Saved successfully.');
    } catch (error) {
      console.log(error);
    }
  };

  // Handles changes to the time picker
  const onTimeChange = (value: Dayjs | null, dateString: string) => {
    handleTimeChange(value, dateString, setTime, setTimeError);
  };

  // Array to later generate the form inputs and placeholder values
  const formItems: FormItem[] = [
    {
      label: 'Hotel Name',
      name: 'hotelName',
      placeholder: 'e.g: Four Seasons New York',
      required: true,
    },
    {
      label: 'Address',
      name: 'hotelAddress',
      placeholder: 'e.g: 57 E 57th St, New York, NY 10022',
    },
    {
      label: 'Confirmation Number',
      name: 'hotelConfirmationNumber',
      placeholder: 'e.g: LM6G7AHE6',
    },
    {
      label: 'Phone Number',
      name: 'hotelPhone',
      placeholder: 'e.g: (212) 758-5700',
    },
    { label: 'Notes', name: 'hotelNotes' },
  ];

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex items-center space-x-4`}
    >
      {/* If the card data is generated, show the collapsable component and generate values based on inputs */}
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full ml-10 bg-white'
          items={[
            {
              key: '1',
              label: (
                <div>
                  <div className='flex'>
                    {time?.dateString}
                    <div className='pl-5'>
                      Check in to {cardData.hotelName}
                      <ul>
                        {cardData.hotelAddress &&
                          `Address: ${cardData.hotelAddress}`}
                      </ul>
                      <ul>
                        {cardData.hotelPhone &&
                          `Phone Number: ${cardData.hotelPhone}`}
                      </ul>
                      <ul>
                        {cardData.hotelConfirmationNumber &&
                          `Confirmation Number: ${cardData.hotelConfirmationNumber}`}
                      </ul>
                      <ul>
                        {cardData.hotelNotes && `Notes: ${cardData.hotelNotes}`}
                      </ul>
                    </div>
                  </div>
                </div>
              ),

              children: (
                <Form form={form} onFinish={handleFormSubmit}>
                  {renderFormItems(
                    cardData as unknown as { [key: string]: string },
                    formItems
                  )}
                  <div
                    className={`flex items-center ${timeError ? '' : 'pb-4'}`}
                  >
                    <span className='text-red-500 pr-1'>* </span> Arrival Time:
                    <TimePicker
                      use12Hours
                      defaultValue={
                        time ? (time.value as Dayjs | undefined) : undefined
                      }
                      className='ml-2'
                      status={timeError ? 'error' : ''}
                      onChange={onTimeChange}
                      format={format}
                    />
                  </div>
                  <div className={timeError ? 'pb-4 text-red-500' : ''}>
                    {timeError}
                  </div>
                  <div>
                    <Button htmlType='submit'>Submit</Button>
                  </div>
                </Form>
              ),
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4 ml-10 bg-white'>
          <Form form={form} onFinish={handleFormSubmit}>
            {renderFormItems(cardData, formItems)}
            <div className={`flex items-center ${timeError ? '' : 'pb-4'}`}>
              <span className='text-red-500 pr-1'>*</span> Arrival Time:
              <TimePicker
                use12Hours
                className='ml-2'
                status={timeError ? 'error' : ''}
                onChange={onTimeChange}
                format={format}
              />
            </div>
            <div className={timeError ? 'pb-4 text-red-500' : ''}>
              {timeError}
            </div>
            <div>
              <Button htmlType='submit'>Submit</Button>
            </div>
          </Form>
        </div>
      )}
      <Trash id={id} setCards={setCards} />
    </div>
  );
}

export default HotelCard;
