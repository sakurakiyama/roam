/**
 * **************************************************
 *
 * @description
 * This component renders the draggable restaurant card.
 *
 * **************************************************
 */

/*
TODO: Add dropdown for booking type 
TODO: Add dropdown for type of meal (lunch, dinner, drinks etc)
*/

import { useDrag } from 'react-dnd';
import { Collapse, Form, Input, Button } from 'antd';
import { useState } from 'react';

const CardType = {
  Card: 'Card',
};

interface RestaurantCardProps {
  name: string;
  id: null | string;
}

interface CardData {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  notes: string;
  arrivalTime: string;
}

interface FormValues {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  notes: string;
  arrivalTime: string;
}

function RestaurantCard({ name, id }: RestaurantCardProps): JSX.Element {
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
        restaurantName,
        restaurantAddress,
        restaurantPhone,
        notes,
        arrivalTime,
      } = values;

      setCardData({
        restaurantName,
        restaurantAddress,
        restaurantPhone,
        notes,
        arrivalTime,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const formItems = [
    {
      label: 'Restaurant Name',
      name: 'restaurantName',
      placeholder: 'e.g: Al Di La Trattoria',
      required: true,
    },
    {
      label: 'Address',
      name: 'restaurantAddress',
      placeholder: 'e.g: 248 5th Ave, Brooklyn, NY 11215',
    },
    {
      label: 'Phone Number',
      name: 'restaurantPhone',
      placeholder: 'e.g: (718) 783-4565',
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
      className={`p-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move m-2 flex items-center`}
    >
      {cardData ? (
        <Collapse
          collapsible='icon'
          className='w-full'
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: (
                <div>
                  <div className='flex pb-5'>
                    {cardData.arrivalTime}
                    <div className='pl-5'>
                      Dinner at {cardData.restaurantName}
                      <ul>
                        {cardData.restaurantAddress
                          ? `Address: ${cardData.restaurantAddress}`
                          : undefined}
                      </ul>
                      <ul>
                        {cardData.restaurantPhone
                          ? `Phone Number: ${cardData.restaurantPhone}`
                          : undefined}
                      </ul>
                      <ul>
                        {cardData.notes
                          ? `Notes: ${cardData.notes}`
                          : undefined}
                      </ul>
                    </div>
                  </div>
                </div>
              ),

              children: (
                <Form form={form} onFinish={handleFormSubmit}>
                  <Form.Item
                    label='restaurant Name'
                    name='restaurantName'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the restaurant name',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.restaurantName} />
                  </Form.Item>
                  <Form.Item label='Address' name='restaurantAddress'>
                    <Input
                      placeholder={
                        cardData.restaurantAddress
                          ? cardData.restaurantAddress
                          : 'e.g: 248 5th Ave, Brooklyn, NY 11215'
                      }
                    />
                  </Form.Item>
                  <Form.Item label='Phone Number' name='restaurantPhone'>
                    <Input
                      placeholder={
                        cardData.restaurantPhone
                          ? cardData.restaurantPhone
                          : 'e.g: (718) 783-4565'
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
        <div className='border rounded-md w-full p-4'>
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

export default RestaurantCard;
