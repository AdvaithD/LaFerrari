pragma solidity ^0.4.22;
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract SmartRegistry is Ownable{
    address[] public addresses;
    struct productData{
        string name;
        string description;
        string expiryDate;
        string CompanyName;
        uint256 units;
    }
    productData[] info;
    //mapping (address => productData) public add_info;
    function SmartRegistry(string _name, string _description, string _expiryDate, string _CompanyName, uint256 _units, address[] _addresses) public onlyOwner{
        productData memory my_info = productData(_name, _description, _expiryDate, _CompanyName, _units);
        info.push(my_info);
        addresses = _addresses;
    }
    function getProductInfo() view returns(string,string,string,string,uint256){
        return(info[0].name,info[0].description,info[0].expiryDate,info[0].CompanyName,info[0].units);
    }
    function updateProductInfo(string _name, string _description, string _expiryDate, string _CompanyName, uint256 _units, address[] _addresses) public onlyOwner{
        productData memory my_info = productData(_name, _description, _expiryDate, _CompanyName, _units);
        info.push(my_info);
        addresses = _addresses;
    }
    function getCount() view returns(uint256){
        return addresses.length;
    }
    function getAddresses() view returns(address[]){
        return addresses;
    }
    
}
