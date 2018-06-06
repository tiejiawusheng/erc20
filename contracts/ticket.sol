pragma solidity ^0.4.18;
import "./TokenDemo.sol";


contract Ticket is TokenRecipient {
    TokenDemo myToken;

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external returns(string) {
        require(myToken == _token);
        require(myToken.transferFrom(_from, this, 100));
        //卖票操作
        return "jd123";
    }

    //设置合约地址
    function setAddress(address contractAdd) {
        myToken = TokenDemo(contractAdd);
    }

    //用eth买ticket
    function getTicket() public payable returns (string) {
        require(msg.value == 0.1 ether);
        return "jd123";
    }

    //用token买ticket
    function getTicketByToken() public  returns (string) {
        require(myToken.transferFrom(msg.sender, this, 100));
        return "jd123";
    }

}  