/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware updates the title of
 * an itinerary
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const updateItineraryTitle = async (req, res, next) => {
  try {
    const { itineraryName, id } = req.body;
    const itinerary = await Itineraries.findOneAndUpdate(
      { _id: id },
      {
        itineraryName,
      },
      { returnOriginal: false }
    );
    res.locals.itinerary = itinerary;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.updateItineraryTitle middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to find update the itineraries title.' },
    });
  }
};

export default updateItineraryTitle;
