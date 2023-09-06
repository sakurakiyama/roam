/**
 * **************************************************
 *
 * @description
 * This component renders the draggable hotel card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Input, Button } from 'antd';
import { useState } from 'react';

/*
TODO: [X] Add logic for rendering placeholders when fields have not been populated.
TODO: Use API to generate fields
TODO: Format inputted times
TODO: Add icon 
TODO: Add confirmed or pending 
*/

const CardType = {
  Card: 'Card',
};

interface HotelCardProps {
  name: string;
  id: null | string;
}

interface CardData {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  confirmationNumber: string;
  notes: string;
  arrivalTime: string;
}

interface FormValues {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  confirmationNumber: string;
  notes: string;
  arrivalTime: string;
}

function HotelCard({ name, id }: HotelCardProps): JSX.Element {
  const [cardData, setCardData] = useState<CardData | undefined>(undefined);
  const [form] = Form.useForm();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  async function handleFormSubmit(values: FormValues) {
    try {
      const {
        hotelName,
        hotelAddress,
        hotelPhone,
        confirmationNumber,
        notes,
        arrivalTime,
      } = values;

      setCardData({
        hotelName,
        hotelAddress,
        hotelPhone,
        confirmationNumber,
        notes,
        arrivalTime,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const formItems = [
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
    {
      label: 'Arrival Time',
      name: 'arrivalTime',
      placeholder: 'e.g: 07:00 PM',
      required: true,
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
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full ml-10'
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: (
                <div>
                  <div className='flex'>
                    {cardData.arrivalTime}
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
                  <Form.Item
                    label='Hotel Name'
                    name='hotelName'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the hotel name',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.hotelName} />
                  </Form.Item>
                  <Form.Item label='Address' name='hotelAddress'>
                    <Input
                      placeholder={
                        cardData.hotelAddress
                          ? cardData.hotelAddress
                          : 'e.g: 57 E 57th St, New York, NY 10022'
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label='Confirmation Number'
                    name='confirmationNumber'
                  >
                    <Input
                      placeholder={
                        cardData.confirmationNumber
                          ? cardData.confirmationNumber
                          : 'e.g: LM6G7AHE6'
                      }
                    />
                  </Form.Item>
                  <Form.Item label='Phone Number' name='hotelPhone'>
                    <Input
                      placeholder={
                        cardData.hotelPhone
                          ? cardData.hotelPhone
                          : 'e.g: (212) 758-5700'
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label='Arrival Time'
                    name='arrivalTime'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the arrival time',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.arrivalTime} />
                  </Form.Item>
                  <Form.Item label='Notes' name='notes'>
                    <Input placeholder={cardData.notes} />
                  </Form.Item>
                  <Button htmlType='submit'>Submit</Button>
                </Form>
              ),
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4 ml-10'>
          <Form form={form} onFinish={handleFormSubmit}>
            {formItems.map((item) => (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={
                  item.required
                    ? [
                        {
                          required: true,
                          message: `Please enter ${item.label.toLowerCase()}`,
                        },
                      ]
                    : undefined
                }
              >
                <Input placeholder={item.placeholder} />
              </Form.Item>
            ))}
            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default HotelCard;
