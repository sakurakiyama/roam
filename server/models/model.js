import mongoose from 'mongoose';
import 'dotenv/config';

// eslint-disable-next-line no-undef
const MONGO_URI = process.env.VITE_MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'TravelItinerary',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  startDate: { type: Date, default: Date.now, required: true },
});

const Users = mongoose.model('Users', userSchema);

const itinerarySchema = new Schema({
  itineraryName: { type: String, default: 'Untitled', required: false },
  userID: { type: String, required: true },
  cards: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

const Itineraries = mongoose.model('Itineraries', itinerarySchema);

const activityCardSchema = new Schema({
  activityName: { type: String, required: false },
  activityAddress: { type: String, required: false },
  activityPhone: { type: String, required: false },
  activityNotes: { type: String, required: false },
  selectedActivityValue: { type: String, required: false },
  itineraryID: { type: String, required: true },
  type: { type: String, required: true },
  activityArrivalTime: { type: String, required: false },
});

const ActivityCards = mongoose.model('ActivityCards', activityCardSchema);

const dateCardSchema = new Schema({
  date: { type: Object, required: false },
  dateString: { type: String, required: false },
  formattedDate: { type: String, required: false },
  itineraryID: { type: String, required: true },
  type: { type: String, required: true },
});

const DateCards = mongoose.model('DateCards', dateCardSchema);

const flightCardSchema = new Schema({
  flightNumber: { type: String, required: false },
  flightConfirmationNumber: { type: String, required: false },
  flightNotes: { type: String, required: false },
  seat: { type: String, required: false },
  departureAirport: { type: String, required: false },
  departureTime: { type: String, required: false },
  departureGate: { type: String, required: false },
  arrivalTime: { type: String, required: false },
  arrivalGate: { type: String, required: false },
  arrivalAirport: { type: String, required: false },
  itineraryID: { type: String, required: true },
  type: { type: String, required: true },
});

const FlightCards = mongoose.model('FlightCards', flightCardSchema);

const hotelCardSchema = new Schema({
  hotelName: { type: String, required: false },
  hotelAddress: { type: String, required: false },
  hotelPhone: { type: String, required: false },
  hotelConfirmationNumber: { type: String, required: false },
  hotelNotes: { type: String, required: false },
  itineraryID: { type: String, required: true },
  type: { type: String, required: true },
  hotelArrivalTime: { type: String, required: false },
});

const HotelCards = mongoose.model('HotelCards', hotelCardSchema);

const restaurantCardSchema = new Schema({
  restaurantName: { type: String, required: false },
  restaurantAddress: { type: String, required: false },
  restaurantPhone: { type: String, required: false },
  restaurantNotes: { type: String, required: false },
  selectedRestaurantValue: { type: String, required: false },
  itineraryID: { type: String, required: true },
  type: { type: String, required: true },
  restaurantArrivalTime: { type: String, required: false },
});

const RestaurantCards = mongoose.model('RestaurantCards', restaurantCardSchema);

export {
  Users,
  Itineraries,
  ActivityCards,
  DateCards,
  FlightCards,
  HotelCards,
  RestaurantCards,
};
