/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This component renders the draggable restaurant card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Button, Checkbox, TimePicker } from 'antd';
import { useState, useEffect } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Dayjs } from 'dayjs';
import {
  renderFormItems,
  handleTimeChange,
  handleCheckBoxChange,
} from '../../utils/cardUtils';
import { CardType, TimeData, FormItem, CardProps } from '../../types';
import Trash from '../shared/Trash';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RestaurantCardData {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantNotes: string;
  selectedRestaurantValue: CheckboxValueType;
}

interface RestaurantFormValues {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantNotes: string;
}

function RestaurantCard({ name, id, setCards }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<RestaurantCardData | undefined>(
    undefined
  );
  const [time, setTime] = useState<TimeData | undefined>(undefined);
  const [timeError, setTimeError] = useState<string>('');
  const [selected, setSelected] = useState<CheckboxValueType>(false);
  const [options, setOptions] = useState([
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Drinks', value: 'Drinks' },
  ]);
  const format = 'hh:mm A';
  const [form] = Form.useForm();

  useEffect(() => {
    const getCardDetails = async () => {
      const { data: cardDetails } = await axios.get(
        `/user/getCardDetails/${id}/${name}`
      );

      if (
        !cardDetails.restaurantName ||
        !cardDetails.restaurantArrivalTime ||
        !cardDetails.restaurantArrivalTime
      )
        return;
      const details: RestaurantCardData = {
        restaurantName: cardDetails.restaurantName || '',
        restaurantAddress: cardDetails.restaurantAddress || '',
        restaurantPhone: cardDetails.restaurantPhone || '',
        restaurantNotes: cardDetails.restaurantNotes || '',
        selectedRestaurantValue: cardDetails.selectedRestaurantValue || '',
      };
      setCardData(details);
      setTime({
        value: null,
        dateString: cardDetails.restaurantArrivalTime || '',
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
  const handleFormSubmit = async (values: RestaurantFormValues) => {
    if (!time?.dateString) {
      setTimeError('Please enter an arrival time');
      return;
    }
    setTimeError('');
    try {
      const {
        restaurantName,
        restaurantAddress,
        restaurantPhone,
        restaurantNotes,
      } = values;

      const restaurantCardData = {
        restaurantName,
        restaurantAddress,
        restaurantPhone,
        restaurantNotes,
        selectedRestaurantValue: selected,
      };
      const { data: updatedCard } = await axios.patch('/user/updateCard', {
        id,
        type: name,
        restaurantArrivalTime: time.dateString,
        ...restaurantCardData,
      });
      // TODO: [] Update the interface to reflect the returned object and use said object to update state

      setCardData(restaurantCardData);
      toast('✅ Saved successfully.');
    } catch (error) {
      console.log(error);
    }
  };

  // Handles changes to the time picker
  const onTimeChange = (value: Dayjs | null, dateString: string) => {
    handleTimeChange(value, dateString, setTime, setTimeError);
  };

  // Listen for changes to the checkbox and only allow one checked item
  const onCheckBoxChange = (checkedValue: CheckboxValueType[]) => {
    handleCheckBoxChange(checkedValue, setSelected, setOptions, options);
  };

  // Array to later generate the form inputs and placeholder values
  const formItems: FormItem[] = [
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
    { label: 'Notes', name: 'restaurantNotes' },
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
                      {cardData.selectedRestaurantValue} at{' '}
                      {cardData.restaurantName}
                      <ul>
                        {cardData.restaurantAddress &&
                          `Address: ${cardData.restaurantAddress}`}
                      </ul>
                      <ul>
                        {cardData.restaurantPhone &&
                          `Phone Number: ${cardData.restaurantPhone}`}
                      </ul>
                      <ul>
                        {cardData.restaurantNotes &&
                          `Notes: ${cardData.restaurantNotes}`}
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
                      defaultValue={[cardData.selectedRestaurantValue]}
                      onChange={onCheckBoxChange}
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
            <div></div>
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
              <Checkbox.Group options={options} onChange={onCheckBoxChange} />
            </Form.Item>

            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
      <Trash id={id} setCards={setCards} />
    </div>
  );
}

export default RestaurantCard;
