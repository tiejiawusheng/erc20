pragma solidity ^0.4.24;


/**
注意solidity的版本，设置为^0.4.24
approveAndCall中，较新的版本才允许函数返回string
turffle version，查看版本，Solidity应该大于等于v0.4.24 (solc-js)
如果不是，需要升级truffle
npm i -g truffle，如果是mac，前面加sudo，win下管理员打开终端
*/
interface TokenRecipient { 
    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external returns (string);
}


/**
* 练习内容
* 1 按照课程演示，熟悉ERC20的基本框架
* 2 理解代理交易的流程，完成基本的ticket程序
* 3 remix运行
*/
contract Token {  
    uint256 public totalSupply;  
    function balanceOf(address _owner) public constant returns (uint256 balance);  
    function transfer(address _to, uint256 _value) public returns (bool success);  
    
    function transferFrom(address _from, address _to, uint256 _value) public returns    (bool success);  
    function approve(address _spender, uint256 _value) public returns (bool success);  
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining);  
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);  
    event Approval(address indexed _owner, address indexed _spender, uint256  _value);  
} 


contract TokenDemo is Token {  
    string public name;                   //名称，例如"My test token"  
    uint8 public decimals;               //返回token使用的小数点后几位。比如如果设置为3，就是支持0.001表示.  
    string public symbol;               //token简称,like MTT  

    //用户的余额
    mapping (address => uint256) balances;  

    //代理的余额，一级key为甲方，二级key为代理，值为甲方给代理的额度
    mapping (address => mapping (address => uint256)) allowed; 
    
    //构造函数
    function TokenDemo(uint256 _initialAmount, string _tokenName, uint8 _decimalUnits, string _tokenSymbol) public {  
        totalSupply = _initialAmount * 10 ** uint256(_decimalUnits);
        balances[msg.sender] = totalSupply;//合约创建者拥有所有的币
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
    }  

    //将自己的token转账给_to地址，_value为转账个数
    function transfer(address _to, uint256 _value) public returns (bool success) {  
        require(_to != 0x0);
        require(balances[msg.sender] >= _value);  //有足够多的币
        require(balances[_to] + _value >= balances[_to]);//防止溢出
        balances[msg.sender] -= _value;//从消息发送者账户中减去token数量_value  
        balances[_to] += _value;//往接收账户增加token数量_value  
        Transfer(msg.sender, _to, _value);//触发转币交易事件  
        return true;  
    }  

    //从地址_from发送数量为_value的token到地址_to
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {  
        require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value);
        require(balances[_to] + _value > balances[_to]);//防止溢出
        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);//触发转币交易事件  
        return true;  
    } 

    //输入地址，可以获取该地址代币的余额
    function balanceOf(address _owner) public constant returns (uint256 balance) {  
        return balances[_owner];  
    }  

    //批准_spender账户从自己的账户转移_value个token。可以分多次转移
    function approve(address _spender, uint256 _value) public returns (bool success)     
    {   
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);  
        return true;  
    } 
     
    //返回_spender还能提取token的个数
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {  
        return allowed[_owner][_spender];//允许_spender从_owner中转出的token数  
    }  

    //_spender为卖票合约地址
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        public
        returns (string) {
            TokenRecipient spender = TokenRecipient(_spender);
            if (approve(_spender, _value)) {
                string memory ticket = spender.receiveApproval(msg.sender, _value, this, _extraData);
                return ticket;
            }
        }
}  