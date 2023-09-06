/**
 * **************************************************
 *
 * @description
 * This component renders the draggable flight card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { useState } from 'react';
import { Collapse, Form, Input, Button } from 'antd';
import axios from 'axios';
import { convertTo12HourFormat } from '../../utils/cardUtils';

const CardType = {
  Card: 'Card',
};

interface FlightCardProps {
  name: string;
  id: null | string;
}

interface FormValues {
  flightNumber: string;
  departureAirport: string;
  confirmationNumber: string;
  notes: string;
  seat: string;
}

interface CardData {
  flightNumber: string;
  confirmationNumber: string;
  notes: string;
  seat: string;
  departureAirport: string;
  departureTime: string;
  departureGate: string;
  arrivalTime: string;
  arrivalGate: string;
  arrivalAirport: string;
}

function FlightCard({ name, id }: FlightCardProps): JSX.Element {
  const [cardData, setCardData] = useState<CardData | undefined>(undefined);
  const [form] = Form.useForm();
  const API_KEY = import.meta.env.VITE_ACCESS_KEY;

  async function handleFormSubmit(values: FormValues) {
    try {
      const {
        flightNumber,
        confirmationNumber,
        departureAirport,
        notes,
        seat,
      } = values;
      const { data } = await axios.get(
        `https://aviation-edge.com/v2/public/timetable?iataCode=${departureAirport}&type=departure&flight_iata=${flightNumber}&key=${API_KEY}`
      );
      // TODO: Add logic for if the flight is not found.
      const info = {
        flightNumber: flightNumber,
        confirmationNumber: confirmationNumber,
        notes: notes,
        seat: seat,
        departureAirport: departureAirport,
        departureTime: convertTo12HourFormat(data[0].departure.scheduledTime),
        departureGate: data[0].departure.gate,
        arrivalTime: convertTo12HourFormat(data[0].arrival.scheduledTime),
        arrivalGate: data[0].arrival.gate,
        arrivalAirport: data[0].arrival.iataCode,
      };
      setCardData(info);
    } catch (error) {
      console.log(error);
    }
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formItems = [
    {
      label: 'Departure Airport',
      name: 'departureAirport',
      placeholder: 'e.g: JFK',
      required: true,
    },
    {
      label: 'Flight Number',
      name: 'flightNumber',
      placeholder: 'e.g: DL230',
      required: true,
    },
    {
      label: 'Confirmation Number',
      name: 'confirmationNumber',
      placeholder: 'e.g: MH6LM',
    },
    { label: 'Seats', name: 'seat', placeholder: 'e.g: 12B' },
    { label: 'Notes', name: 'notes' },
  ];

  return (
    <div
      ref={drag}
      key={id}
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
                    {cardData.departureTime}
                    <div className='pl-5 pb-5'>
                      Depart {cardData.departureAirport} for{' '}
                      {cardData.arrivalAirport} on {cardData.flightNumber}
                      <ul>
                        {cardData.confirmationNumber &&
                          `Confirmation Number: ${cardData.confirmationNumber} `}
                      </ul>
                      <ul>Departure Gate: {cardData.departureGate}</ul>
                      <ul>{cardData.seat && `Seats: ${cardData.seat}`}</ul>
                      <ul>{cardData.notes && `Notes: ${cardData.notes}`}</ul>
                    </div>
                  </div>
                  <div className='flex'>
                    <div>{cardData.arrivalTime}</div>
                    <div className='pl-5'>
                      Arrive at {cardData.arrivalAirport}
                    </div>
                  </div>
                </div>
              ),
              children: (
                <Form form={form} onFinish={handleFormSubmit}>
                  <Form.Item
                    label='Departure Airport'
                    name='departureAirport'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the airport code',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.departureAirport} />
                  </Form.Item>
                  <Form.Item
                    label='Flight Number'
                    name='flightNumber'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a flight number',
                      },
                    ]}
                  >
                    <Input placeholder={cardData.flightNumber} />
                  </Form.Item>
                  <Form.Item
                    label='Confirmation Number'
                    name='confirmationNumber'
                  >
                    <Input placeholder={cardData.confirmationNumber} />
                  </Form.Item>
                  <Form.Item label='Seats' name='seat'>
                    <Input placeholder={cardData.seat} />
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

export default FlightCard;
