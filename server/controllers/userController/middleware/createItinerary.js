/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware creates new
 * itineraries
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const createItinerary = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const itinerary = await Itineraries.create({ userID });
    res.locals.newItinerary = itinerary;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.createItinerary middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to create an itinerary.' },
    });
  }
};

export default createItinerary;
