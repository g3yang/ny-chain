const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');



describe('Wallet',()=>{
    let wallet, tp, bc;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    })

    describe('creating a transaction',()=>{
        let transaction, sendAmount, recipient;

        beforeEach(()=>{
            sendAmount = 50;
            recipient = 'rnd-12323';
            transaction = wallet.createTransaction(recipient, sendAmount,bc, tp);
        });

        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient, sendAmount, bc, tp);
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

        
    });

    describe('calculating a balance',()=>{
        let addBalance, repeatAdd, senderWallet;
        beforeEach(()=>{
            senderWallet = new Wallet();
            addBalance = 100;
            addTimes = 3;
            for (let i=0;i<addTimes;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance of recipient',()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+ addBalance * addTimes);
        });

        it('calculate the balance of sender',()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance * addTimes);

        });

        describe('and recipient conducts a transaction',()=>{
           let subtractBalance, recipientBalance;
           
           beforeEach(()=>{
               tp.clear();
               subtractBalance = 60;
               recipientBalance = wallet.calculateBalance(bc);
               wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
               bc.addBlock(tp.transactions);
           });

           describe('the sender sends another transaction to recipient',()=>{
               beforeEach(()=>{
                  tp.clear();
                  senderWallet.createTransaction(wallet.publicKey,addBalance, bc, tp);
                  bc.addBlock(tp.transactions);
               });

               it('calculate the recipient balance',()=>{
                   expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-subtractBalance+addBalance);
               })
           })
        })
    })


})