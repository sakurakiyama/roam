/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

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
import updateItinerary from './middleware/updateItineray.js';

export default {
  getUser,
  createUser,
  createItinerary,
  getItineraries,
  createNewCard,
  updateCard,
  updateItinerary,
};
