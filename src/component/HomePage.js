import { Checkbox, Button } from '@mui/material';
import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import NFTImage from "./NFTImage";
import BigNumber from "bignumber.js";

import graybg from "../Images/GrayBackground.png"
import { fontSize } from '@mui/system';

const HomePage = () => {

  let [tokenIDs, setTokenIDs] = useState([]);
  
  const [selectedTokenIds, setSelectedTokenIds] = useState([]);
  const dispatch = useDispatch();
  var [faction1, setFaction1] = useState([]);
  var [faction2, setFaction2] = useState([]);
  var [faction3, setFaction3] = useState([]);
  var [isApprovedForAll, setIsApprovedForAll] = useState([]);

  const blockchain = useSelector((state) => state.blockchain);

  async function getTokenIds(){ 
  
    if(blockchain.CGBSmartContract){
      tokenIDs = await blockchain.CGBSmartContract.methods.getWalletOfOwner(blockchain.account).call();
      console.log(tokenIDs);
      //fetchImages();
      setTokenIDs(tokenIDs);
    }
  }
  
  async function isApprovedCGB()
  {
    const lockerContractAddress = "0xb57252faf8a7910be62e1f35ec6e0ddb478f2868";
    if(blockchain.account && blockchain.CGBSmartContract)
    {
      isApprovedForAll = await blockchain.CGBSmartContract.methods.isApprovedForAll(blockchain.account, lockerContractAddress).call();
      console.log("isapprovedCGB");
      console.log(isApprovedForAll);
      setIsApprovedForAll(isApprovedForAll);
    }

  }
  async function getFactionCount(){
    
    if(blockchain.GorLocSmartContract)
    {
      faction1 = await blockchain.GorLocSmartContract.methods.factionBurnCount(0).call();
      setFaction1(faction1);
      console.log(faction1);
      faction2 = await blockchain.GorLocSmartContract.methods.factionBurnCount(1).call();
      setFaction2(faction2);
      console.log(faction2);
      faction3 = await blockchain.GorLocSmartContract.methods.factionBurnCount(2).call();
      setFaction3(faction3);
      console.log(faction3);

    }
  } 

  const handleCheckboxChange = (tokenId) => {
    const intId = BigNumber(tokenId.toString());
    if (selectedTokenIds.includes(intId)) {
      setSelectedTokenIds(selectedTokenIds.filter((id) => id !== intId));
    } else {
      setSelectedTokenIds([...selectedTokenIds, intId]);
    }
    console.log(selectedTokenIds);
  };

  async function safeApprovalCGB(){
    var safeApproval = await blockchain.CGBSmartContract.methods.setApprovalForAll("0xb57252faf8a7910be62e1f35ec6e0ddb478f2868",true)
    .send({
      gas: "285000",
      from: blockchain.account,
    });
    console.log(safeApproval);
  }

  async function mintNFT()  {
   
    console.log(selectedTokenIds.length);
    if(selectedTokenIds.length < 3){
      alert("Please select atleast 3 CGB to mint");
    }
    else{
      if(selectedTokenIds.length%3 === 0)
      {
        const multiplier = selectedTokenIds.length/3;
        const mintPrice = 75*multiplier;
        console.log(mintPrice);
        //const estGas = await blockchain.ZFSmartContract.methods.mint(selectedTokenIds).estimateGas({ from: blockchain.account });
        //console.log(estGas);
        await blockchain.ZFSmartContract.methods.mint(selectedTokenIds).send({
          gas: "585000",
          from: blockchain.account,
          value: blockchain.web3.utils.toWei((mintPrice).toString(), "ether"),
        }).once("error", (err) => {
          console.log(err);
        })
        .then((receipt) => {
          dispatch(fetchData());
        });
      }
      else{
          alert("Select NFTs in the multiple of 3");
      }
      
    }
  };

  useEffect(() => {
    getTokenIds();
    getFactionCount();
    isApprovedCGB();
  }, [blockchain.account]);

  return (
    <main >

      <div className='Notes desc  '>

      <label className=' newFont' > To receive a Zombie you must have 3 gorillas from either Aqua, Ignis or Terra. (Excluding Mafia) + \
      75 CRO 700 Aqua, Ignis and Terra will be burnt giving us Zombies 
      Any combination of the 3 factions will work with a cap of 700 each. </label>
      </div>

      <div className='faction'>

        {/* <label className='newFont' > Aqua: </label>
          <label className='newFont' > {faction1} </label>
        <br/>
        <label className='newFont' > Terra:</label>
          <label className='newFont' >{faction2} </label>
        <br/>
        <label className='newFont' > Ignis: </label>
          <label className='newFont' >{faction3} </label>
        <br/> */}

      </div>




      <div className='imageBundle'>


        {tokenIDs.map((tokenID, index) => (
          
        <label className='imageWcheck' > 

        { tokenID <= 1000 ? null : ( 
        <> 
          { !((tokenID > 1000 && tokenID < 2701 && faction1<700) || (tokenID > 2700 && tokenID < 4401 && faction2<700) || (tokenID > 4400 && tokenID <= 6100 && faction3<700))? null : ( 
        <>
          <NFTImage  key={tokenID} imageUrl={`https://bafybeibshhfup5upjwz6akbpcw2in57qwojj5jmfpk3id2mmprpme34ite.ipfs.dweb.link/${tokenID}`+`.png`} />
        
          <input className='checkit' type="checkbox" value={tokenID} onChange={() => handleCheckboxChange(tokenID)}/>
        </> 
        ) } </> )} 
        
        </label> ))} 
        

      </div>

      


      <div className='MintButton'  >
        { isApprovedForAll ? (
        <>     
        <Button style={{background:"#ef476f", borderRadius:"0px", color:"#d8d8d8" }} onClick={mintNFT}>
          <a style={{fontSize:"20px"}} className='newFont mintHover '> Mint</a>
        </Button>
        </>
            ): (
        <Button style={{background:"#ef476f", borderRadius:"0px", color:"#d8d8d8" , }} onClick={safeApprovalCGB}>
          <a style={{fontSize:"20px"}} className='newFont mintHover '>Approve</a>
        </Button>)}
      </div>




    </main>
  );
}


export default HomePage