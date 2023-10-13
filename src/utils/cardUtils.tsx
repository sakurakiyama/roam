/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * **************************************************
 *
 * @description
 * This file stores all the utils for the cards.
 *
 * **************************************************
 */

import FlightCard from '../components/cards/FlightCard';
import HotelCard from '../components/cards/HotelCard';
import RestaurantCard from '../components/cards/RestaurantCard';
import ActivityCard from '../components/cards/ActivityCard';
import Placeholder from '../components/cards/Placeholder';
import DateCard from '../components/cards/DateCard';
import { Form, Input } from 'antd';
import { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { TimeData, FormItem } from '../types';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import axios from 'axios';
import { CardObj } from '../types';

// Converts the timestamp to the correct format
export const convertTo12HourFormat = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
};

// Creates new cards when dropped
export const createNewCards = async (
  item: { name: string; id?: string },
  itineraryID: string | undefined,
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  switch (item.name) {
    case 'Flight Card':
      const { data: newFlightCard } = await axios.post('/user/createNewCard', {
        itineraryID,
        type: item.name,
      });
      return (
        <FlightCard
          name='Flight Card'
          id={newFlightCard._id}
          setCards={setCards}
        />
      );

    case 'Hotel Card':
      const { data: newHotelCard } = await axios.post('/user/createNewCard', {
        itineraryID,
        type: item.name,
      });
      return (
        <HotelCard
          name='Hotel Card'
          id={newHotelCard._id}
          setCards={setCards}
        />
      );

    case 'Restaurant Card':
      const { data: newRestaurantCard } = await axios.post(
        '/user/createNewCard',
        { itineraryID, type: item.name }
      );
      return (
        <RestaurantCard
          name='Restaurant Card'
          id={newRestaurantCard._id}
          setCards={setCards}
        />
      );

    case 'Activity Card':
      const { data: newActivityCard } = await axios.post(
        '/user/createNewCard',
        { itineraryID, type: item.name }
      );
      return (
        <ActivityCard
          name='Activity Card'
          id={newActivityCard._id}
          setCards={setCards}
        />
      );

    case 'Date Card':
      const { data: newDateCard } = await axios.post('/user/createNewCard', {
        itineraryID,
        type: item.name,
      });
      return (
        <DateCard name='Date Card' id={newDateCard._id} setCards={setCards} />
      );
    default:
      return <div>A broken div, I see!</div>;
  }
};

// Handles the rearranging of cards and creation of placeholders in the appropriate places
export const zipCards = (
  cards: JSX.Element[],
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  const noPlaceholders = cards.filter((card) => {
    return card.props.name;
  });

  const result: JSX.Element[] = noPlaceholders.reduce(
    (acc: JSX.Element[], card: JSX.Element) => {
      acc.push(<Placeholder setCards={setCards} id={uuidv4()} />);
      acc.push(card);
      return acc;
    },
    []
  );
  return result;
};

// Formats the date
export const formatDate = (inputDate: string) => {
  const dateObj = new Date(inputDate);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const day = dayNames[dateObj.getDay()];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  const dayOfMonth = dateObj.getDate();
  return `${day}, ${month} ${dayOfMonth}, ${year}`;
};

// Renders the form items
export const renderFormItems = (
  cardData: { [key: string]: string } | undefined,
  formItems: FormItem[]
) => {
  return formItems.map((item) => (
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
      <Input
        placeholder={
          cardData ? cardData[item.name] || item.placeholder : item.placeholder
        }
      />
    </Form.Item>
  ));
};

// Checks to see if the time has changed and if not, sets an error
export const handleTimeChange = (
  value: Dayjs | null,
  dateString: string,
  setTime: (time: TimeData) => void,
  setTimeError: (error: string) => void
) => {
  if (value === null) {
    setTimeError('Please enter an arrival time');
    return;
  }
  setTimeError('');
  setTime({ value, dateString });
};

// Only allow one checked item and update state
export const handleCheckBoxChange = (
  checkedValue: CheckboxValueType[],
  setSelected: (selected: CheckboxValueType) => void,
  setOptions: (options: { label: string; value: string }[]) => void,
  options: { label: string; value: string }[]
) => {
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

export const renderCards = (
  cards: CardObj[],
  setCards: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  const allCards = cards.map((card) => {
    switch (card.type) {
      case 'Flight Card':
        return (
          <FlightCard name='Flight Card' id={card.id} setCards={setCards} />
        );

      case 'Hotel Card':
        return <HotelCard name='Hotel Card' id={card.id} setCards={setCards} />;

      case 'Restaurant Card':
        return (
          <RestaurantCard
            name='Restaurant Card'
            id={card.id}
            setCards={setCards}
          />
        );

      case 'Activity Card':
        return (
          <ActivityCard name='Activity Card' id={card.id} setCards={setCards} />
        );

      case 'Date Card':
        return <DateCard name='Date Card' id={card.id} setCards={setCards} />;
      default:
        return <div>A broken div, I see!</div>;
    }
  });

  if (allCards.length === 1) {
    allCards.unshift(<Placeholder setCards={setCards} id={uuidv4()} />);
    allCards.push(<Placeholder setCards={setCards} id={uuidv4()} />);
    setCards(allCards);
  } else {
    const cardsToRender = zipCards(allCards, setCards);
    setCards([
      ...cardsToRender.flat(),
      <Placeholder setCards={setCards} id={uuidv4()} />,
    ]);
  }
};
