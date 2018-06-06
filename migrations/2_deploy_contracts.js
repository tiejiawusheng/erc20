
//var 变量名称必须与合约名称一致
var Hello = artifacts.require("Hello");
var Multi = artifacts.require("./Multi.sol");

module.exports = function(deployer) {
  // 部署单个合约,不带任何构造参数
  deployer.deploy(Hello);
  //部署单个合约带有构造参数
  deployer.deploy(Multi, 11);

  // 部署多个合约,一些有参数,一些没有参数
  /*
    deployer.deploy([
        [A, arg1, arg2, ...],
        B,
        [C, arg1]
    ]);
   */

    // 部署LibA库, 然后将LibA链接到合约B, 然后再部署B
    /*
    deployer.deploy(LibA);
    deployer.link(LibA, B);
    deployer.deploy(B);
    */
    
    // Link LibA to many contracts
    // 将LibA链接到许多合约
    //deployer.link(LibA, [B, C, D]);

    // 按顺序部署
    /*
    deployer.deploy(A).then(function() {
        return deployer.deploy(B, A.address);
    });
  */
};
