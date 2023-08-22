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
export default Users;
