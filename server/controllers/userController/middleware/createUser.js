/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ====================================
 *        MIDDLEWARE FUNCTION
 * This middleware adds user to datbase
 * ====================================
 */

import { Users } from '../../../models/model.js';

const createUser = async (req, res, next) => {
  try {
    const { email, nickname } = req.body;
    const newUser = await Users.create({ email: email, username: nickname });
    res.locals.user = newUser;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.getUser middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to find user.' },
    });
  }
};

export default createUser;
