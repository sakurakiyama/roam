/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware updates the cards for
 * a given itinerary
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const updateItineraryCards = async (req, res, next) => {
  try {
    const { cards, id } = req.body;
    const itinerary = await Itineraries.findOneAndUpdate(
      { _id: id },
      {
        cards,
      },
      { returnOriginal: false }
    );
    res.locals.itinerary = itinerary;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.updatedItineraryCards middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to update the cards for given itinerary.' },
    });
  }
};

export default updateItineraryCards;
