/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
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
    console.log(error);
  }
};

export default getItineraries;
