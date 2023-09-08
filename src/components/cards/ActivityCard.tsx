/**
 * **************************************************
 *
 * @description
 * This component renders the draggable activity card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { Collapse, Form, Button, Checkbox } from 'antd';
import { useState } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CardProps, CardType } from '../../types';
import { renderFormItems, handleCheckBoxChange } from '../../utils/cardUtils';

interface ActivityCardData {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  notes: string;
  arrivalTime: string;
  selectedValue: CheckboxValueType;
}

interface ActivityFormValues {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  notes: string;
  arrivalTime: string;
}

function ActivityCard({ name, id }: CardProps): JSX.Element {
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
    {
      label: 'Arrival Time',
      name: 'arrivalTime',
      placeholder: 'e.g: 12:00 PM',
      required: true,
    },

    { label: 'Notes', name: 'notes' },
  ];

  const [form] = Form.useForm();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Handle form submission
  const handleFormSubmit = async (values: ActivityFormValues) => {
    try {
      const {
        activityName,
        activityAddress,
        activityPhone,
        notes,
        arrivalTime,
      } = values;

      setCardData({
        activityName,
        activityAddress,
        activityPhone,
        notes,
        arrivalTime,
        selectedValue: selected,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckBoxChange = (checkedValue: CheckboxValueType[]) => {
    handleCheckBoxChange(checkedValue, setSelected, setOptions, options);
  };

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
                      {cardData.activityName}
                      <ul>
                        {cardData.activityAddress &&
                          `Address: ${cardData.activityAddress}`}
                      </ul>
                      <ul>
                        {cardData.activityPhone &&
                          `Phone Number: ${cardData.activityPhone}`}
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
            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
