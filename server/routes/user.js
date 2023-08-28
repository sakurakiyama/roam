/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Router } from 'express';
import userController from '../controllers/userController/index.js';
const router = Router();

router.get('/getUser/:email', userController.getUser, (req, res) => {
  return res.status(200).json(res.locals.user);
});

router.post('/createUser', userController.createUser, (req, res) => {
  return res.status(200).json(res.locals.user);
});

export default router;
