//合约部分
var Web3 = require('web3');
console.log(Web3.version);

//设置web3对象
var web3 = new Web3('http://eth.chinahadoop.cn');
var json = require("../build/contracts/TokenDemo.json");
var abi = json["abi"];

var contract_address = "0x27784b548d3c80893f046a8add28c083e4d89a53";

//合约实例
var contract = new web3.eth.Contract(abi, contract_address);


var user1 = "0x6A2BE5C44aD4Fb94c301Dd4dC1C15228D1Ff27DF";
var user2 = "0xd09A13316E1Dda3c0032003C6567Be994744B1F1";
getBalance(user1);
transfer1(user1, user2, 133);



function getBalance(address) {
    //获取address的余额
    contract.methods.balanceOf(address).call().then(
        function(result){
            console.log(result);
        }
    );
}

function transfer(_from, _to, _value) {
    //编码函数和参数
    let data = contract.methods.transfer(_to, _value).encodeABI();
    console.log(data);
    console.log(contract_address);

    //user1账号的私钥
    sendPri = "0xb55192b37f3d03a35f3146182f75cbbd4d099da3621b6cf472a5aca570528784";

    //调用合约，相当于向合约发送交易
    web3.eth.accounts.signTransaction({
        to: contract_address,
        gas: 1000000,
        data:data,
        //chainId:81 //这个是我们自建网络的id
    }, sendPri)
    .then(function(res){
        console.log(web3.utils.isHex(res.rawTransaction)); // is true
        console.log(res.rawTransaction);
        web3.eth.sendSignedTransaction(res.rawTransaction).then(
            function(result) {
                console.log(result);
            }
        )
    }
)}

function transfer1(_from, _to, _value) {
    //编码函数和参数
    let data = contract.methods.transfer(_to, _value).encodeABI();
    console.log(data);
    console.log(contract_address);

    //user1账号的私钥
    sendPri = "0xb55192b37f3d03a35f3146182f75cbbd4d099da3621b6cf472a5aca570528784";

    //调用合约，相当于向合约发送交易
    web3.eth.accounts.signTransaction({
        //from:_from,
        to: contract_address,
        gas: 1000000,
        data:data,
        //value:0,
        //chainId:81 //注意，这个是我们自建网络的id
    }, sendPri)
    .then(function(res){
        console.log(web3.utils.isHex(res.rawTransaction)); // is true
        console.log(res.rawTransaction);
        web3.eth.sendSignedTransaction(res.rawTransaction).on('transactionHash', function (txHash) {
        }).on('receipt', function (receipt) {
            console.log("receipt:" + receipt);
        }).on('confirmation', function (confirmationNumber, receipt) {
            console.log("confirmationNumber:" + confirmationNumber + " receipt:" + receipt);
        }).on('error', function (error) {
            console.log("error"+ error);
        });
    }
)}

