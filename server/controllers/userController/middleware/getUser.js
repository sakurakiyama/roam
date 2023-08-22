/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ====================================
 *        MIDDLEWARE FUNCTION
 * ====================================
 */

import Users from '../../../models/model.js';

const getUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await Users.findOne({ email: email });
    res.locals.user = user;
    return next();
  } catch (error) {
    return next({
      log: `Error occured in userController.getUser middleware: ${error}`,
      status: 400,
      message: { error: 'Unable to find user.' },
    });
  }
};

export default getUser;
