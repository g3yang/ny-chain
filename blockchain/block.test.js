const Block = require('./block');


describe('Block',()=>{
    let data, lastBlock, block;

    beforeEach(()=>{
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

   it('set the `data` to match input', ()=>{
       expect(block.data).toEqual(data);
   });

   it('verify the `lastHash`',()=>{
       expect(block.lastHash).toEqual(lastBlock.hash);
   });

   it('generates a hash that meets the criteria',()=>{
       expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
       console.log(block.toString());
   });

   it('lower difficulty for slowly mined block', ()=>{
        expect(Block.adjustDifficulty(block, block.timestamp + 18000)).toEqual(block.difficulty-1);
   });

   it('raise difficulty for quickly mined block',()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+1000)).toEqual(block.difficulty+1);
   });


})