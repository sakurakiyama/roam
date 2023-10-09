/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware creates new cards
 * ====================================
 */

import {
  DateCards,
  ActivityCards,
  RestaurantCards,
  HotelCards,
  FlightCards,
} from '../../../models/model.js';

const createNewCard = async (req, res, next) => {
  try {
    const { itineraryID, type } = req.body;
    let newCard;
    switch (type) {
      case 'Flight Card':
        newCard = await FlightCards.create({ itineraryID, type });
        break;
      case 'Hotel Card':
        newCard = await HotelCards.create({ itineraryID, type });
        break;
      case 'Restaurant Card':
        newCard = await RestaurantCards.create({ itineraryID, type });
        break;
      case 'Activity Card':
        newCard = await ActivityCards.create({ itineraryID, type });
        break;
      case 'Date Card':
        newCard = await DateCards.create({ itineraryID, type });
        break;
    }
    res.locals.newCard = newCard;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.createNewCard middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to create a new card.' },
    });
  }
};

export default createNewCard;
