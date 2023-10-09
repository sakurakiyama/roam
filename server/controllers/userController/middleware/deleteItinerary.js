/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware deletes itineraries
 * ====================================
 */

import { Itineraries } from '../../../models/model.js';

const deleteItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Itineraries.findByIdAndDelete(id);
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.deleteItinerary middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to delete an itinerary.' },
    });
  }
};

export default deleteItinerary;
