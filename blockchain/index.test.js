const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain',()=>{
    let bc, bc2;

    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block',()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block',()=>{
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validate valid chain',()=>{
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    })


    it('invalidate a corrupted genesis block',()=>{
        bc2.chain[0].data = 'on9';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('validate a corrupted chain',()=>{
        bc2.addBlock('foo');
        bc2.chain[1].data = 'jess';
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    });

    it('replace a valid blockchain',()=>{
        bc2.addBlock('goo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    })

    it('not replace a shorter chain',()=>{
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    })
    

})