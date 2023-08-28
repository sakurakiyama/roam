/**
 * **************************************************
 *
 * @description
 * This component renders the cards
 *
 * **************************************************
 */

import FlightCard from './FlightCard';
import RestaurantCard from './RestaurantCard';
import HotelCard from './HotelCard';

function Cards(): JSX.Element {
  return (
    <div className='border-solid border-2'>
      <FlightCard name='Flight Card' id={null} />
      <RestaurantCard name='Restaurant Card' id={null} />
      <HotelCard name='Hotel Card' id={null} />
    </div>
  );
}

export default Cards;
