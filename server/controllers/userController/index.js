/**
 * **************************************************
 *
 * @module userController
 *
 * @description
 * This is a collection of Express middleware functions
 * used for interacting with user information
 *
 * **************************************************
 */

import getUser from './middleware/getUser.js';
import createUser from './middleware/createUser.js';
import createItinerary from './middleware/createItinerary.js';
import getItineraries from './middleware/getItineraries.js';
import createNewCard from './middleware/createNewCard.js';
import updateCard from './middleware/updateCard.js';
import updateItineraryTitle from './middleware/updateItineraryTitle.js';
import deleteItinerary from './middleware/deleteItinerary.js';
import updateItineraryCards from './middleware/updateItineraryCards.js';
import getItineraryDetails from './middleware/getItineraryDetails.js';

export default {
  getUser,
  createUser,
  createItinerary,
  getItineraries,
  createNewCard,
  updateCard,
  updateItineraryTitle,
  deleteItinerary,
  updateItineraryCards,
  getItineraryDetails,
};
