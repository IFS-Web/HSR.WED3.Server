import {userService} from '../services/userService';

async function register(req, res, next) {
  let {login, firstname, lastname, password} = req.body;
  try {
      res.send(await userService.register(login, firstname, lastname, password));
  } catch(err) {
    next(err);
  }
}

async function login(req, res, next) {
    let {login, password} = req.body;
    try {
        res.send(await userService.login(login, password));
    } catch(err) {
        next(err);
    }
}

export const userController = {register, login};
