import {accountService} from '../services/accountService';
import {userService} from '../services/userService';

async function getAccountByParams(req, res, next) {
	await getAccount(req, res, next, req.params.accountNr);
}

async function getAccountByToken(req, res, next) {
	await getAccount(req, res, next, req.user.accountNr);
}

async function getAccount(req, res, next, accountNr) {
  try {
      const account = await accountService.get(accountNr);
      const user = await userService.getById(account.ownerId);

      if (String(req.user.accountNr) === accountNr) {
          account.owner = user;
          res.json(account);
      }
      else {
          let {accountNr} = account;
          let {firstname, lastname} = user;
          res.json({accountNr, owner: {firstname, lastname}});
      }
  }
  catch (err) {
      next(err);
  }
}

async function getTransactions(req, res, next) {
    try {
        res.json(
            await accountService.getTransactions(
                String(req.user.accountNr),
                req.query.count ? parseInt(req.query.count) : 0,
                req.query.skip ? parseInt(req.query.skip) : 0,
                req.query.fromDate ? new Date(req.query.fromDate) : null,
                req.query.toDate ? new Date(req.query.toDate) : null));
    } catch (err) {
        next(err);
    }
}

async function addTransactions(req, res, next) {
    try {
        res.json(
            await accountService.addTransaction(
                String(req.user.accountNr),
                String(req.body.target),
                parseFloat(req.body.amount),
                null));
    } catch (err) {
        next(err);
    }
}

export const accountController = { getAccountByToken, getAccountByParams, getTransactions, addTransactions };
