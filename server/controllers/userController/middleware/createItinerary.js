/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
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
    console.log(error);
  }
};

export default createItinerary;
