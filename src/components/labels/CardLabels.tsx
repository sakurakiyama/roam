/**
 * **************************************************
 *
 * @description
 * This component renders the cards labels
 *
 * **************************************************
 */

import Label from './Label';
import { FaPlane } from 'react-icons/fa';
import { MdDinnerDining, MdHotel, MdOutlineExplore } from 'react-icons/md';
import { BsCalendarDate } from 'react-icons/bs';
import { CardLabelTypes } from '../../types';

function CardLabels(): JSX.Element {
  const iconSize = 25;
  const iconColor = 'white';
  const cards: CardLabelTypes[] = [
    {
      name: 'Flight Card',
      icon: <FaPlane size={iconSize} fill={iconColor} />,
      color: 'bg-lime-300',
    },
    {
      name: 'Hotel Card',
      icon: <MdHotel size={iconSize} fill={iconColor} />,
      color: 'bg-blue-200',
    },
    {
      name: 'Restaurant Card',
      icon: <MdDinnerDining size={iconSize} fill={iconColor} />,
      color: 'bg-indigo-200',
    },
    {
      name: 'Activity Card',
      icon: <MdOutlineExplore size={iconSize} fill={iconColor} />,
      color: 'bg-fuchsia-100',
    },
    {
      name: 'Date Card',
      icon: <BsCalendarDate size={iconSize} fill={iconColor} />,
      color: 'bg-yellow-200',
    },
  ];

  return (
    <div>
      {cards.map((card) => {
        return (
          <Label
            key={card.name}
            name={card.name}
            icon={card.icon}
            color={card.color}
          />
        );
      })}
    </div>
  );
}

export default CardLabels;
