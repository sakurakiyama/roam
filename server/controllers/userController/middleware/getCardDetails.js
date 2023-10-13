/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware gets a cards
 * details
 * ====================================
 */

import {
  DateCards,
  ActivityCards,
  RestaurantCards,
  HotelCards,
  FlightCards,
} from '../../../models/model.js';

const getCardDetails = async (req, res, next) => {
  try {
    const { id, name } = req.params;
    let cardDetails;
    switch (name) {
      case 'Restaurant Card':
        cardDetails = await RestaurantCards.findOne({ _id: id });
        break;
      case 'Hotel Card':
        cardDetails = await HotelCards.findOne({ _id: id });
        break;
      case 'Flight Card':
        cardDetails = await FlightCards.findOne({ _id: id });
        break;
      case 'Date Card':
        cardDetails = await DateCards.findOne({ _id: id });
        break;
      case 'Activity Card':
        cardDetails = await ActivityCards.findOne({ _id: id });
        break;
    }
    res.locals.cardDetails = cardDetails;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.getCardDetails middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to get card details.' },
    });
  }
};

export default getCardDetails;
