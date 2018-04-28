const SHA256 = require('crypto-js/sha256');

const {DIFFICULTY, MINE_RATE} = require('../config');

const isValidHash = (hash) => {
    return hash.substring(0, DIFFICULTY) == '0'.repeat(DIFFICULTY);
}

class Block{
    constructor(timestamp, lastHash, hash, data,nonce, difficulty){
        this.timestamp= timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block -
            Timestamp  : ${this.timestamp}
            Last Hash  : ${this.lastHash.substring(0,10)}
            Hash       : ${this.hash.substring(0,10)}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}
        `
    }

    static genesis(){
        return new this('Genesis time', '-----','asasda',[], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
       const lastHash = lastBlock.hash;
       let difficulty = lastBlock.difficulty;
       let hash;
       let nonce=0;
       let timestamp;

       do{
           nonce++;
           timestamp = Date.now();
           difficulty = Block.adjustDifficulty(lastBlock, timestamp);
           hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
       } while (!isValidHash(hash));

       return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTimestamp){
        let difficulty = lastBlock.difficulty;
        if (lastBlock.timestamp + MINE_RATE > currentTimestamp){
            difficulty +=1;
        } else {
            difficulty -=1;
        } 

        return difficulty;
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static hashBlock(block){
       const {timestamp, lastHash, data, nonce, difficulty} = block;
       return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }
}

module.exports=Block;