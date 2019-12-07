# cryptocurrency-concept-in-javascript

## Installation

```
1) git clone https://github.com/sarthaksadh01/cryptocurrency-concept-in-javascript.git
2) cd cryptocurrency-concept-in-javascript
3) npm install
4) npm start

```

## Features

```
1) Adding transaction
2) Mining
3) Is Chain Valid
4) Replace chain (if longer chain exist)
5) Adding nodes 
6) Get Connected Nodes
7) Getting your Chain

```
## definition

```javascript

class BlockChain {

    constructor(myWallet) {
        this.nodes = new Set();
        this.transactions = [];
        this.chain = [];
        this.createBlock()
        this.myWallet = myWallet
    }

    getPrevBlock() {
        return this.chain[this.chain.length - 1];
    }

    getChain() {
        return this.chain;
    }

    getAllTransactions() {
        return this.transactions
    }
    getAllConnectedNodes(){
        return this.nodes;
    }


    isChainValid(chain=this.chain) {
        for (var i = 1; i < chain.length; i++) {
            if (chain[i].prevHash != chain[i - 1].hash) {
                return false;
            }

        }
        return true;
    }

    createBlock(nonce = 1, prevHash = '0'.repeat(64), transactions = [], hash = sha256('1' + "randomData" + '0' + '0')) {

        this.chain.push({
            nonce,
            index: this.chain.length,
            transactions,
            prevHash,
            hash,
            timeStamp: Date().toString()
        })

    }


    async addTransaction(sender = "", receiver = "", coins = 0, fees = 0.1) {
        var uid = await uidgen.generate();
        this.transactions.push(
            {
                sender,
                receiver,
                coins,
                fees,
                uid
            }
        )


    }

    replaceChain(){
        var longestChain = this.chain
        this.nodes.forEach((node)=>{

            var chain = request.get(node);
            var chainLength = chain.length;
            if(this.isChainValid(chain)&&chainLength>longestChain.length){
                longestChain=chain;
                this.chain=chain;
            }
            

        });
    }



    addNodes(node) {
        this.nodes.add(node);
    }


    mineBlock(difficulty = 4) {
        var index = this.chain.length;
        var prevBlock = this.chain[index - 1];
        var nonce = 1;
        if(this.transactions.length==1&&this.transactions[0].fees==0)return;
        console.log("mining block -- " + index);
        var hash = sha256(this.transactions + prevBlock.hash + index + nonce)
        while (hash.substring(0, difficulty) != '0'.repeat(difficulty)) {
            nonce += 1;
            hash = sha256(this.transactions + prevBlock.hash + index + nonce);
        }
        this.createBlock(nonce, prevBlock.hash, this.transactions, hash);
        this.transactions = [{
            "sender":"scoin",
            "receiver":this.myWallet,
            "coins":0.1,
            
        }];


    }



}


```