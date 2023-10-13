/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware updates cards
 * ====================================
 */

import {
  DateCards,
  ActivityCards,
  RestaurantCards,
  HotelCards,
  FlightCards,
} from '../../../models/model.js';

const updateCard = async (req, res, next) => {
  const { id, type } = req.body;
  try {
    let updatedCard;
    switch (type) {
      case 'Flight Card':
        const {
          flightNumber,
          flightConfirmationNumber,
          flightNotes,
          seat,
          departureAirport,
          departureTime,
          departureGate,
          arrivalTime,
          arrivalGate,
          arrivalAirport,
        } = req.body;

        updatedCard = await FlightCards.findByIdAndUpdate(
          id,
          {
            flightNumber,
            flightConfirmationNumber,
            flightNotes,
            seat,
            departureAirport,
            departureTime,
            departureGate,
            arrivalTime,
            arrivalGate,
            arrivalAirport,
          },
          { returnOriginal: false }
        );
        break;

      case 'Hotel Card':
        const {
          hotelName,
          hotelAddress,
          hotelPhone,
          hotelConfirmationNumber,
          hotelNotes,
          hotelArrivalTime,
        } = req.body;

        updatedCard = await HotelCards.findByIdAndUpdate(
          id,
          {
            hotelName,
            hotelAddress,
            hotelPhone,
            hotelConfirmationNumber,
            hotelNotes,
            hotelArrivalTime,
          },
          { returnOriginal: false }
        );
        break;

      case 'Restaurant Card':
        const {
          restaurantName,
          restaurantAddress,
          restaurantPhone,
          restaurantNotes,
          selectedRestaurantValue,
          restaurantArrivalTime,
        } = req.body;

        updatedCard = await RestaurantCards.findByIdAndUpdate(
          id,
          {
            restaurantName,
            restaurantAddress,
            restaurantPhone,
            restaurantNotes,
            selectedRestaurantValue,
            restaurantArrivalTime,
          },
          { returnOriginal: false }
        );
        break;

      case 'Activity Card':
        const {
          activityName,
          activityAddress,
          activityPhone,
          activityNotes,
          selectedActivityValue,
          activityArrivalTime,
        } = req.body;

        updatedCard = await ActivityCards.findByIdAndUpdate(
          id,
          {
            activityName,
            activityAddress,
            activityPhone,
            activityNotes,
            selectedActivityValue,
            activityArrivalTime,
          },
          { returnOriginal: false }
        );
        break;

      case 'Date Card':
        const { date, dateString, formattedDate } = req.body;
        updatedCard = await DateCards.findByIdAndUpdate(
          id,
          {
            date,
            dateString,
            formattedDate,
          },
          { returnOriginal: false }
        );
        break;
    }
    res.locals.updatedCard = updatedCard;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.updateCard middleware: ${error}`,
      status: 400,
      message: { error: `Unable to update ${type}.` },
    });
  }
};

export default updateCard;
