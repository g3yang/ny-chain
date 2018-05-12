const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');



describe('Transaction pool',()=>{
    let tp, transaction, wallet,bc;
    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-xyz',30, tp);
    });


    it('add a transaction',()=>{
        console.log(tp);
        const tr = tp.transactions.find(tr=>tr.id == transaction.id);
        expect(tr).toEqual(transaction);
    });

    it('update a transaction',()=>{
        const old_tr_str = JSON.stringify(transaction);
        const new_tr = transaction.update(wallet, 'sdsds-sx', 200);
        tp.updateOrAddTransaction(new_tr);

        const new_tr_str = JSON.stringify(tp.transactions.find(t=>t.id == transaction.id));
        expect(new_tr_str).not.toEqual(old_tr_str);
    });

    it('clears transactions',()=>{
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing corrupt and valid transaction',()=>{
       let validTransactions;

       beforeEach(()=>{
           validTransactions = [...tp.transactions];
           for(let i=0; i<6;i++){
               wallet = new Wallet();
               transaction = wallet.createTransaction('jy-nyang',30, tp);
               if(i%2==0){
                   transaction.input.amount = 99;
               }else{
                   validTransactions.push(transaction);
               }
           }
       });

       it('show difference between valid and invalid transactions', ()=>{
          expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
       });

       it('grab the valid transactions',()=>{
           expect(tp.validTransactions()).toEqual(validTransactions);
       })

    })

})