/**
 * **************************************************
 *
 * @description
 * This component renders the draggable activity card.
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

interface ActivityCardProps {
  name: string;
  id: null | string;
}

interface CardData {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  notes: string;
  arrivalTime: string;
  selectedValue: CheckboxValueType;
}

interface FormValues {
  activityName: string;
  activityAddress: string;
  activityPhone: string;
  notes: string;
  arrivalTime: string;
}

function ActivityCard({ name, id }: ActivityCardProps): JSX.Element {
  const [cardData, setCardData] = useState<CardData | undefined>(undefined);
  const [selected, setSelected] = useState<CheckboxValueType>(false);
  const [options, setOptions] = useState([
    { label: 'Museum', value: 'Museum' },
    { label: 'Explore', value: 'Explore' },
    { label: 'Sailing', value: 'Sailing' },
    { label: 'Relaxing', value: 'Relaxing' },
  ]);

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
  }

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

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex  items-center`}
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
                  <Form.Item
                    label='Activity Description'
                    name='activityName'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the activity description',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.activityName} />
                  </Form.Item>
                  <Form.Item label='Address' name='activityAddress'>
                    <Input
                      placeholder={
                        cardData.activityAddress
                          ? cardData.activityAddress
                          : 'e.g: 248 5th Ave, Brooklyn, NY 11215'
                      }
                    />
                  </Form.Item>
                  <Form.Item label='Phone Number' name='activityPhone'>
                    <Input
                      placeholder={
                        cardData.activityPhone
                          ? cardData.activityPhone
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

export default ActivityCard;
