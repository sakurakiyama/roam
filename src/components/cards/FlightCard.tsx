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
import { Collapse, Form, Button } from 'antd';
import axios from 'axios';
import { convertTo12HourFormat, renderFormItems } from '../../utils/cardUtils';
import { CardProps, CardType } from '../../types';
import Trash from '../shared/Trash';

// TODO: [] Add logic for if the flight is not found.

interface FlightFormValues {
  flightNumber: string;
  departureAirport: string;
  confirmationNumber: string;
  notes: string;
  seat: string;
}

interface FlightCardData {
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

function FlightCard({ name, id, setCards }: CardProps): JSX.Element {
  const [cardData, setCardData] = useState<FlightCardData | undefined>(
    undefined
  );
  const [form] = Form.useForm();

  // Array to later generate the form inputs and placeholder values
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

  const API_KEY = import.meta.env.VITE_ACCESS_KEY;

  // Handles form submission
  const handleFormSubmit = async (values: FlightFormValues) => {
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
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: CardType.Card,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      key={id}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move mx-2 flex items-center space-x-4 `}
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
                  {renderFormItems(
                    cardData as unknown as { [key: string]: string },
                    formItems
                  )}
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
            <Button htmlType='submit'>Submit</Button>
          </Form>
        </div>
      )}
      <Trash id={id} setCards={setCards} />
    </div>
  );
}

export default FlightCard;
