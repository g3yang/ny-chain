const Transaction = require('../wallet/transaction');


class TransactionPool{
    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
        let existingTransaction = this.transactions.find(t=>t.id == transaction.id);
        if(existingTransaction){
            this.transactions[this.transactions.indexOf(existingTransaction)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address){
        return this.transactions.find(tr=>tr.input.address == address);
    }

    validTransactions(){
        return this.transactions.filter(transaction=>{
           const outputTotal = transaction.outputs.reduce((total, output)=>{
               return total + output.amount;
           },0);

           console.log(`Output total ${outputTotal} Input amount: ${transaction.input.amount}`);
           if(transaction.input.amount !== outputTotal){
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return;
           }

           if(!Transaction.verifyTransaction(transaction)){
               console.log(`Invalid signature from ${transaction.input.address}`);
               return;
           }
           return transaction;
        });
    }

    clear(){
        this.transactions=[];
    }
}

module.exports = TransactionPool;