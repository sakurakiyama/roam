/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This component renders the draggable flight card.
 *
 * **************************************************
 */

import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import { Collapse, Form, Button } from 'antd';
import axios from 'axios';
import { convertTo12HourFormat, renderFormItems } from '../../utils/cardUtils';
import { CardProps, CardType } from '../../types';
import Trash from '../shared/Trash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO: [] Add logic for if the flight is not found.

interface FlightFormValues {
  flightNumber: string;
  departureAirport: string;
  flightConfirmationNumber: string;
  flightNotes: string;
  seat: string;
}

interface FlightCardData {
  flightNumber: string;
  flightConfirmationNumber: string;
  flightNotes: string;
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
      name: 'flightConfirmationNumber',
      placeholder: 'e.g: MH6LM',
    },
    { label: 'Seats', name: 'seat', placeholder: 'e.g: 12B' },
    { label: 'Notes', name: 'flightNotes' },
  ];

  useEffect(() => {
    const getCardDetails = async () => {
      const { data: cardDetails } = await axios.get(
        `/user/getCardDetails/${id}/${name}`
      );

      const details: FlightCardData = {
        flightNumber: cardDetails.flightNumber || '',
        flightConfirmationNumber: cardDetails.flightConfirmationNumber || '',
        flightNotes: cardDetails.flightNotes || '',
        seat: cardDetails.seat || '',
        departureAirport: cardDetails.departureAirport || '',
        departureTime: cardDetails.departureTime || '',
        departureGate: cardDetails.departureGate || '',
        arrivalTime: cardDetails.arrivalTime || '',
        arrivalGate: cardDetails.arrivalGate || '',
        arrivalAirport: cardDetails.arrivalAirport || '',
      };
      setCardData(details);
    };
    getCardDetails();
  }, [id, name]);

  const API_KEY = import.meta.env.VITE_ACCESS_KEY;

  // Handles form submission
  const handleFormSubmit = async (values: FlightFormValues) => {
    try {
      const {
        flightNumber,
        flightConfirmationNumber,
        departureAirport,
        flightNotes,
        seat,
      } = values;
      const { data } = await axios.get(
        `https://aviation-edge.com/v2/public/timetable?iataCode=${departureAirport}&type=departure&flight_iata=${flightNumber}&key=${API_KEY}`
      );
      const info = {
        flightNumber,
        flightConfirmationNumber,
        flightNotes,
        seat,
        departureAirport,
        departureTime: convertTo12HourFormat(data[0].departure.scheduledTime),
        departureGate: data[0].departure.gate,
        arrivalTime: convertTo12HourFormat(data[0].arrival.scheduledTime),
        arrivalGate: data[0].arrival.gate,
        arrivalAirport: data[0].arrival.iataCode,
      };

      const { data: updatedCard } = await axios.patch('/user/updateCard', {
        id,
        type: name,
        ...info,
      });
      // TODO: [] Update the interface to reflect the returned object and use said object to update state

      setCardData(info);
      toast('✅ Saved successfully.');
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
                        {cardData.flightConfirmationNumber &&
                          `Confirmation Number: ${cardData.flightConfirmationNumber} `}
                      </ul>
                      <ul>Departure Gate: {cardData.departureGate}</ul>
                      <ul>{cardData.seat && `Seats: ${cardData.seat}`}</ul>
                      <ul>
                        {cardData.flightNotes &&
                          `Notes: ${cardData.flightNotes}`}
                      </ul>
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
