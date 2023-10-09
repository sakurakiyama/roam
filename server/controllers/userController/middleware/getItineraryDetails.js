/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware gets an itineraries
 * details
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const getItineraryDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itineraryDetails = await Itineraries.findOne({ _id: id });
    res.locals.details = itineraryDetails;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.getItineraryDetails middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to get itinerary details.' },
    });
  }
};

export default getItineraryDetails;
