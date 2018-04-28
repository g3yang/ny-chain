const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
       const lastBlock = this.chain[this.chain.length-1];
       const currBlock = Block.mineBlock(lastBlock,data);
       this.chain.push(currBlock);
       return currBlock;
    }


    isValidChain(chain){
       if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
           console.warn('Failed Genisis check')
           return false;
       }

       for(let i=1; i<chain.length;i++){
          const currBlock = chain[i];
          const lastBlock = chain[i-1];
          if(currBlock.lastHash !== lastBlock.hash || currBlock.hash !== Block.hashBlock(currBlock)){
             return false;
          }
       }

       return true;
    }

    replaceChain(newChain){
        if(newChain.length<= this.chain.length){
            console.log('Received chain is not longer than the current one');
            return;
        }else if(!this.isValidChain(newChain)){
            console.log('Received chain is not valid');
            return;
        }

        console.log('Replacing the current chain with the received one');
        this.chain = newChain;
    }
}

module.exports = Blockchain;