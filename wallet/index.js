const {INITIAL_BALANCE} = require('../config');
const ChainUtil = require('../chain-util'); 
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance=INITIAL_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    
    }

    toString(){
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance: ${this.balance}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain);

        if(amount>this.balance){
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
           transaction.update(this, recipient, amount);
        } else {
           transaction = Transaction.newTransaction(this,recipient,amount);
        }

        transactionPool.updateOrAddTransaction(transaction);

        return transaction;
    }


    calculateBalance(blockchain){
        let balance = this.balance;
        let allTransactions = [];

        blockchain.chain.forEach(block=>{
           block.data.forEach(transaction=>{
               allTransactions.push(transaction);
           })
        });

        const outgoingTransactions = allTransactions.filter(transaction=>transaction.input.address == this.publicKey);
        let startTime = 0;
        if(outgoingTransactions.length>0){
            const recentOutTransaction = outgoingTransactions.reduce((prev, curr)=>{
               prev.input.timestamp > curr.input.timestamp?prev:curr
            });

            balance = recentOutTransaction.outputs.find(output=>output.address==this.publicKey).amount;
            startTime = recentOutTransaction.input.timestamp;
        }

        allTransactions.forEach(transaction=>{
            if(transaction.input.timestamp>startTime){
                transaction.outputs.find(output=>{
                    if(output.address == this.publicKey){
                        balance += output.amount;
                    }
                })
            }
        });

        return balance;
    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }

}

module.exports = Wallet;