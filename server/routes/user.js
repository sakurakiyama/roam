import { Router } from 'express';
import userController from '../controllers/userController/index.js';
const router = Router();

router.get('/getUser/:email', userController.getUser, (req, res) => {
  return res.status(200).json(res.locals.user);
});

router.post('/createUser', userController.createUser, (req, res) => {
  return res.status(200).json(res.locals.user);
});

router.post('/createItinerary', userController.createItinerary, (req, res) => {
  return res.status(200).json(res.locals.newItinerary);
});

router.get('/getItineraries/:id', userController.getItineraries, (req, res) => {
  return res.status(200).json(res.locals.itineraries);
});

router.post('/createNewCard', userController.createNewCard, (req, res) => {
  return res.status(200).json(res.locals.newCard);
});

router.patch('/updateCard', userController.updateCard, (req, res) => {
  return res.status(200).json(res.locals.updatedCard);
});

router.patch('/updateItinerary', userController.updateItinerary, (req, res) => {
  return res.status(200).json(res.locals.itinerary);
});
export default router;
