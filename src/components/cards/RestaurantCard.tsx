/**
 * **************************************************
 *
 * @description
 * This component renders the draggable restaurant card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Input, Button, Checkbox } from 'antd';
import { useState } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

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
  selectedValue: CheckboxValueType;
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
  const [selected, setSelected] = useState<CheckboxValueType>(false);
  const [options, setOptions] = useState([
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Drinks', value: 'Drinks' },
  ]);

  const [form] = Form.useForm();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Handles form submission
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
        selectedValue: selected,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Listen for changes to the checkbox and only allow one checked item.
  const onChange = (checkedValue: CheckboxValueType[]) => {
    const selectedValue = checkedValue[0] as string;
    let updatedOptions;
    if (selectedValue === undefined) {
      updatedOptions = options.map((option) => ({
        ...option,
        disabled: false,
      }));
    } else {
      updatedOptions = options.map((option) => ({
        ...option,
        disabled: option.value !== selectedValue,
      }));
    }
    setSelected(selectedValue);
    setOptions(updatedOptions);
  };

  // Array to later generate the form inputs and placeholder values
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
                    {cardData.arrivalTime}
                    <div className='pl-5'>
                      {cardData.selectedValue} at {cardData.restaurantName}
                      <ul>
                        {cardData.restaurantAddress &&
                          `Address: ${cardData.restaurantAddress}`}
                      </ul>
                      <ul>
                        {cardData.restaurantPhone &&
                          `Phone Number: ${cardData.restaurantPhone}`}
                      </ul>
                      <ul>{cardData.notes && `Notes: ${cardData.notes}`}</ul>
                    </div>
                  </div>
                </div>
              ),

              children: (
                <Form form={form} onFinish={handleFormSubmit}>
                  <Form.Item
                    label='Restaurant Name'
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
                  <Form.Item
                    label='Type'
                    name='selectedOptions'
                    rules={[
                      {
                        required: true,
                        message: 'Please select at one option',
                      },
                    ]}
                  >
                    <Checkbox.Group
                      options={options}
                      defaultValue={[cardData.selectedValue]}
                      onChange={onChange}
                    />
                  </Form.Item>
                  <Button htmlType='submit'>Submit</Button>
                </Form>
              ),
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4 ml-10 bg-white'>
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
            <Form.Item
              label='Type'
              name='selectedOptions'
              rules={[
                {
                  required: true,
                  message: 'Please select at one option',
                },
              ]}
            >
              <Checkbox.Group options={options} onChange={onChange} />
            </Form.Item>

            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;
