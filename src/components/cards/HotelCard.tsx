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
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { renderFormItems, handleTimeChange } from '../../utils/cardUtils';
import { CardType, TimeData, FormItem, CardProps } from '../../types';

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
  confirmationNumber: string;
  notes: string;
}

interface HotelFormValues {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  confirmationNumber: string;
  notes: string;
}

function HotelCard({ name, id }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<HotelCardData | undefined>(
    undefined
  );
  const [time, setTime] = useState<TimeData | undefined>(undefined);
  const [timeError, setTimeError] = useState<string>('');
  const [form] = Form.useForm();
  const format = 'hh:mm A';

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
      const { hotelName, hotelAddress, hotelPhone, confirmationNumber, notes } =
        values;

      setCardData({
        hotelName,
        hotelAddress,
        hotelPhone,
        confirmationNumber,
        notes,
      });
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
      name: 'confirmationNumber',
      placeholder: 'e.g: LM6G7AHE6',
    },
    {
      label: 'Phone Number',
      name: 'hotelPhone',
      placeholder: 'e.g: (212) 758-5700',
    },
    { label: 'Notes', name: 'notes' },
  ];

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex items-center`}
    >
      {/* If the card data is generated, show the collapsable component and generate values based on inputs */}
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full ml-10 bg-white'
          defaultActiveKey={['1']}
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
                        {cardData.confirmationNumber &&
                          `Confirmation Number: ${cardData.confirmationNumber}`}
                      </ul>
                      <ul>{cardData.notes && `Notes: ${cardData.notes}`}</ul>
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
    </div>
  );
}

export default HotelCard;
