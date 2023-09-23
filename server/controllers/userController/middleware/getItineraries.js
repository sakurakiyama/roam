/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware gets all a users
 * itineraries
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const getItineraries = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itineraries = await Itineraries.find({ userID: id });
    res.locals.itineraries = itineraries;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.getItineraries middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to find users itineraries.' },
    });
  }
};

export default getItineraries;
