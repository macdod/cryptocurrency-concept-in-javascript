var sha256 = require("sha256");
var request = require('request');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
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

        // this.notifyAddedTransaction(sender, receiver, coins, fees,uid)

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
            "fees":0
            
        }];


    }




    // notifyMinedBlock() {

    //     this.nodes.forEach((node) => {
    //         request.post(
    //             node,
    //             {
    //                 json:{


    //                 }
    //             }
    //         )



    //     });

    // }

    // notifyAddedTransaction(sender, receiver, coins, fees,uid) {


    //     this.nodes.forEach((node) => {
    //         console.log(node+"/new-transaction-notification")
    //         request.post(
    //             node+"/new-transaction-notification",
    //             {
    //                 json: {
    //                     sender,
    //                     receiver,
    //                     coins,
    //                     fees,
    //                     uid
    //                 }
    //             },
    //             function (error, response, body) {
    //                 if(error)console.log(error);
    //                 else console.log(body)

            
    //             }
    //         );



    //     });


    // }

}

module.exports = {
    BlockChain
}