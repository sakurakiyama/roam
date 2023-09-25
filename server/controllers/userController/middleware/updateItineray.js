/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware gets all a users
 * itineraries
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const updateItinerary = async (req, res, next) => {
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
      log: `Error occured in userController.getItineraries middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to find users itineraries.' },
    });
  }
};

export default updateItinerary;
