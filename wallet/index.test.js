const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');


describe('Wallet',()=>{
    let wallet, tp;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
    })

    describe('creating a transaction',()=>{
        let transaction, sendAmount, recipient;

        beforeEach(()=>{
            sendAmount = 50;
            recipient = 'rnd-12323';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient, sendAmount, tp);
            })

            it('amount is subtracted twice',()=>{
                const output = transaction.outputs.find(o=>o.address == wallet.publicKey);
                expect(output.amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the send amount',()=>{
                const outputs = transaction.outputs.filter(o=>o.address == recipient);
                expect(outputs.map(o=>o.amount)).toEqual([sendAmount, sendAmount]);
            })
        })

        
    })
})