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
import { MdHotel } from 'react-icons/md';
import { MdDinnerDining } from 'react-icons/md';
import { CardLabelTypes } from '../../types';

function CardLabels(): JSX.Element {
  const cards: CardLabelTypes[] = [
    { name: 'Flight Card', icon: <FaPlane /> },
    { name: 'Hotel Card', icon: <MdHotel /> },
    { name: 'Restaurant Card', icon: <MdDinnerDining /> },
  ];

  return (
    <div className='border-solid border-2'>
      {cards.map((card) => {
        return <Label name={card.name} icon={card.icon} />;
      })}
    </div>
  );
}

export default CardLabels;
