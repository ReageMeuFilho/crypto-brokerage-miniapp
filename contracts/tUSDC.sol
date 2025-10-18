// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract tUSDC {
  string public constant name="TestUSDC"; 
  string public constant symbol="tUSDC"; 
  uint8 public constant decimals=6;
  
  mapping(address=>uint) public balanceOf; 
  mapping(address=>mapping(address=>uint)) public allowance;
  
  event Transfer(address indexed from, address indexed to, uint v); 
  event Approval(address indexed o, address indexed s, uint v);
  
  function mint(address to, uint v) external { 
    balanceOf[to]+=v; 
    emit Transfer(address(0), to, v); 
  }
  
  function approve(address s, uint v) external returns(bool) { 
    allowance[msg.sender][s]=v; 
    emit Approval(msg.sender, s, v); 
    return true; 
  }
  
  function transfer(address to, uint v) external returns(bool) { 
    require(balanceOf[msg.sender]>=v); 
    balanceOf[msg.sender]-=v; 
    balanceOf[to]+=v; 
    emit Transfer(msg.sender, to, v); 
    return true; 
  }
  
  function transferFrom(address f, address t, uint v) external returns(bool) { 
    require(balanceOf[f]>=v && allowance[f][msg.sender]>=v); 
    balanceOf[f]-=v; 
    allowance[f][msg.sender]-=v; 
    balanceOf[t]+=v; 
    emit Transfer(f, t, v); 
    return true; 
  }
}
