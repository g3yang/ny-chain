const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', ()=>{
    let transaction, wallet, recipient, amount;

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50; 
        recipient = 'jubo';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    })

    it('output the amount from sender balance', ()=>{
       const senderOutput = transaction.outputs.find((o)=> o.address == wallet.publicKey);
       expect(senderOutput.amount).toEqual(wallet.balance - amount);
    });

    it('output the amount credited to recipitent', ()=>{
        const recipientOutput = transaction.outputs.find(o=>o.address == recipient);
        expect(recipientOutput.amount).toEqual(amount);
    });

    it('input the balane of wallet',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validate a valid transaction',()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidate a corrupt transaction',()=>{
        transaction.outputs[0].amount = 5000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });


    describe('amounter greater than sender balance',()=>{
        beforeEach(()=>{
            amount=5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('no transasction',()=>{
            expect(transaction).toEqual(undefined);
        })
    });

    describe('update transaction',()=>{
        let newAmount, newRecipient;
        beforeEach(()=>{
            newAmount = 20;
            newRecipient = 'yulia';
            transaction = transaction.update(wallet, newRecipient, newAmount);
        });

        it(`subtract the amount from sender's amount`,()=>{
            const output = transaction.outputs.find(output=>output.address == wallet.publicKey);
            expect(output.amount).toEqual(wallet.balance-amount-newAmount);
        })
    });

    describe('creating a reward transaction',()=>{
        beforeEach(()=>{
           transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it(`reward the miner's wallet`,()=>{
            const walletOutput = transaction.outputs.find(output=>output.address == wallet.publicKey);
            expect(walletOutput.amount).toEqual(MINING_REWARD);
        })
    })


    

})