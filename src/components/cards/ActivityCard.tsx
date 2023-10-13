/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This component renders the draggable activity card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Button, Checkbox, TimePicker } from 'antd';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CardProps, CardType, TimeData } from '../../types';
import {
  renderFormItems,
  handleCheckBoxChange,
  handleTimeChange,
} from '../../utils/cardUtils';
import Trash from '../shared/Trash';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ActivityCardData {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  activityNotes: string;
  selectedActivityValue: CheckboxValueType;
}

interface ActivityFormValues {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  activityNotes: string;
}

function ActivityCard({ name, id, setCards }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<ActivityCardData | undefined>(
    undefined
  );
  const [selected, setSelected] = useState<CheckboxValueType>(false);
  const [options, setOptions] = useState([
    { label: 'Museum', value: 'Museum' },
    { label: 'Explore', value: 'Explore' },
    { label: 'Sailing', value: 'Sailing' },
    { label: 'Relaxing', value: 'Relaxing' },
  ]);
  const [time, setTime] = useState<TimeData | undefined>(undefined);
  const [timeError, setTimeError] = useState<string>('');

  const [form] = Form.useForm();
  const format = 'hh:mm A';

  // Array to later generate the form inputs and placeholder values
  const formItems = [
    {
      label: 'Activity Description',
      name: 'activityName',
      placeholder: 'e.g: Explore the historic walled city',
      required: true,
    },
    {
      label: 'Address',
      name: 'activityAddress',
      placeholder:
        'e.g: Torre del Reloj Plaza de Los Coches, Cartagena, Bolívar, Colombia',
    },
    {
      label: 'Phone Number',
      name: 'activityPhone',
      placeholder: 'e.g: +57 300 8057290',
    },
    { label: 'Notes', name: 'activityNotes' },
  ];

  useEffect(() => {
    const getCardDetails = async () => {
      const { data: cardDetails } = await axios.get(
        `/user/getCardDetails/${id}/${name}`
      );

      if (
        !cardDetails.activityName ||
        !cardDetails.selectedActivityValue ||
        !cardDetails.activityArrivalTime
      )
        return;

      const details: ActivityCardData = {
        activityName: cardDetails.activityName || '',
        activityAddress: cardDetails.activityAddress || '',
        activityPhone: cardDetails.activityPhone || '',
        activityNotes: cardDetails.activityNotes || '',
        selectedActivityValue: cardDetails.selectedActivityValue || '',
      };
      setCardData(details);
      setTime({
        value: null,
        dateString: cardDetails.activityArrivalTime || '',
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

  // Handle form submission
  const handleFormSubmit = async (values: ActivityFormValues) => {
    if (!time?.dateString) {
      setTimeError('Please enter an arrival time');
      return;
    }
    setTimeError('');
    try {
      const { activityName, activityAddress, activityPhone, activityNotes } =
        values;

      const activityCardData = {
        activityName,
        activityAddress,
        activityPhone,
        activityNotes,
        selectedActivityValue: selected,
      };
      const { data: updatedCard } = await axios.patch('/user/updateCard', {
        id,
        type: name,
        activityArrivalTime: time.dateString,
        ...activityCardData,
      });

      // TODO: [] Update the interface to reflect the returned object and use said object to update state
      setCardData(activityCardData);
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

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex items-center space-x-4 `}
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
                      {cardData.activityName}
                      <ul>
                        {cardData.activityAddress &&
                          `Address: ${cardData.activityAddress}`}
                      </ul>
                      <ul>
                        {cardData.activityPhone &&
                          `Phone Number: ${cardData.activityPhone}`}
                      </ul>
                      <ul>
                        {cardData.activityNotes &&
                          `Notes: ${cardData.activityNotes}`}
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
                      defaultValue={[cardData.selectedActivityValue]}
                      onChange={onCheckBoxChange}
                    />
                  </Form.Item>
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
                  <Button htmlType='submit'>Submit</Button>
                </Form>
              ),
            },
          ]}
        />
      ) : (
        <div className='border rounded-md w-full p-4 ml-10 bg-white'>
          <Form form={form} onFinish={handleFormSubmit}>
            {renderFormItems(
              cardData as unknown as { [key: string]: string },
              formItems
            )}
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
            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
      <Trash id={id} setCards={setCards} />
    </div>
  );
}

export default ActivityCard;
