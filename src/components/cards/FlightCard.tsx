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
import { useState } from 'react';
import { DatePicker, Form, Input, Button } from 'antd';
import axios from 'axios';
import { Moment } from 'moment';

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

function FlightCard({ name, id }: FlightCardProps): JSX.Element {
  const [cardData, setCardData] = useState([]);
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
      console.log(data);
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

  return (
    <div
      ref={drag}
      key={id}
      className={`p-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } text-xl font-bold cursor-move bg-green-100 m-2 flex items-center`}
    >
      <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item
          label='Departure Airport'
          name='departureAirport'
          rules={[{ required: true, message: 'Please enter the airport code' }]}
        >
          <Input placeholder='e.g: JFK' />
        </Form.Item>
        <Form.Item
          label='Flight Number'
          name='flightNumber'
          rules={[{ required: true, message: 'Please enter a flight number' }]}
        >
          <Input placeholder='e.g: DL230' />
        </Form.Item>
        <Form.Item label='Confirmation Number' name='confirmationNumber'>
          <Input placeholder='e.g: MH6LM' />
        </Form.Item>
        <Form.Item label='Seats' name='seat'>
          <Input placeholder='e.g: 12B' />
        </Form.Item>
        <Form.Item label='Notes' name='notes'>
          <Input />
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default FlightCard;
