App = {
  web3: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
      console.log(Web3.version);
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
        App.web3 = new Web3(web3.currentProvider);
      } else {
        //App.web3 = new Web3('http://eth.chinahadoop.cn');
        App.web3 = new Web3('http://localhost:8545/');
        console.log("error, no metamask");
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('TokenDemo.json', function(json) {
        var abi = json["abi"];
        var contract_address = "0x27784b548d3c80893f046a8add28c083e4d89a53";
        //合约实例
        App.contracts = new App.web3.eth.Contract(abi, contract_address);
        App.getBalances();  
    })

    return App.bindEvents();
    
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function() {
    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + '  to ' + toAddress);
    $("#transferButton").attr('disabled',true);
    App.web3.eth.getAccounts().then(
        function(result) {
            address = result[0];
            //获取address的余额
            App.contracts.methods.transfer(toAddress, amount).send({from:address}).then(
                function(result){
                    alert('Transfer Successful!');
                    App.getBalances();
                    $("#transferButton").attr('disabled',false);
                }
            );
        }
    )
  },

  //获得余额
  getBalances: function() {
    console.log('Getting balances...');
    App.web3.eth.getAccounts().then(
        function(result) {
            address = result[0];
            //获取address的余额
            App.contracts.methods.balanceOf(address).call().then(
                function(result){
                    $('#TTBalance').text(result);
                }
            );
        }
    )
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
