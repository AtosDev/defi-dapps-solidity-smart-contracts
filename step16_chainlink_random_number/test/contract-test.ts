import { ethers, waffle, fundLink} from "hardhat";
import { expect } from "chai";
import { VRFD20, VRFD20__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const hre:HardhatRuntimeEnvironment = require("hardhat");

const houseNames: string[] = [
  "Targaryen",
  "Lannister",
  "Stark",
  "Tyrell",
  "Baratheon",
  "Martell",
  "Tully",
  "Bolton",
  "Greyjoy",
  "Arryn",
  "Frey",
  "Mormont",
  "Tarley",
  "Dayne",
  "Umber",
  "Valeryon",
  "Manderly",
  "Clegane",
  "Glover",
  "Karstark"
];


describe("VRFD20", function () {
  it("Should return a house name", async function () {
    const [owner, addr1]: SignerWithAddress[] = await ethers.getSigners();

    const Contract: VRFD20__factory = await ethers.getContractFactory("VRFD20");
    
    const vrfCoordinatorAddress = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";
    const linkContractAddress = "0xa36085f69e2889c224210f603d836748e7dc0088";

    const contract: VRFD20 = await Contract.deploy(vrfCoordinatorAddress, linkContractAddress, 
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4", 
      100000000000000000n);
  
    await contract.deployed();
    
    // 10 Link Tokens
    await fundLink(hre,contract.address, "10000000000000000000" , linkContractAddress);
    const updatedLinkBalance = await contract.checkLinkBalance();
    console.log("Updated Link Balance = ",updatedLinkBalance.toString());

    const transaction = await contract.rollDice(await addr1.getAddress());
    const tx_receipt = await transaction.wait();

    const diceRolledEvent = tx_receipt.events?.filter(eventItem=>{
      return eventItem.event=="DiceRolled";
    });
    const requestId = diceRolledEvent && diceRolledEvent[0].topics[1]
    console.log("Request Id = ",requestId);
    expect(requestId).to.be.not.null;

    //expect(await contract.getHouse(await addr1.getAddress())).to.oneOf(houseNames);

  
  });
});


