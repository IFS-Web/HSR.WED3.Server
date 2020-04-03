import {userService} from '../services/userService';
import {accountService} from '../services/accountService';

const initialAccountData = [
    { accountNr: null, login: "user1", firstname: "Bob", lastname: "Müller", password: "1234" },
    { accountNr: null, login: "user2", firstname: "Lisa", lastname: "Meier", password: "1234" },
    { accountNr: null, login: "user3", firstname: "Kevin", lastname: "Schmidt", password: "1234" }
];

const startDate = +(new Date(2019, 8, 7));

const randomTransactionAmount = 150; // $
const maxTransactions = 1500;

function getRandomAccountId() {
    const maxIdx = initialAccountData.length - 1;
    const randomIdx = Math.round(Math.random() * maxIdx);

    return initialAccountData[randomIdx].accountNr;
}

async function createTransaction() {
    let currentTransaction = 0;

    async function createTransactionRecursive() {
        await accountService.addTransaction(
            getRandomAccountId(),
            getRandomAccountId(),
            Math.round(Math.random() * randomTransactionAmount),
            new Date(startDate + (3600 * currentTransaction * 1000 * 3)));

        if (++currentTransaction < maxTransactions) {
            await createTransactionRecursive();
        }
    }
    await createTransactionRecursive();
}

export const dataSeed = {
    async insertSeedData() {
        if (!await userService.tryGetByLogin(initialAccountData[0].login)) {
            for (let initialData of initialAccountData) {
                const account = await userService.register(
                    initialData.login,
                    initialData.firstname,
                    initialData.lastname,
                    initialData.password,
					startDate);

                initialData.accountNr = account.accountNr;
            }
            await createTransaction();
        }
    }
};
