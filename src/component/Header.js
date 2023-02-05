import '../styles/header.css';
import '../styles/modal.css';

import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/data/dataActions";
import { connectMM } from "../redux/blockchain/blockchainActions";
import { connectWC } from "../redux/blockchain/blockchainActions";

import { useNavigate } from "react-router-dom";
//import BBLogo from "./assets/images/HeadLogo.gif";
import { $ } from 'jquery';

import SelectWalletModal from "./Model";

import headerlogo from '../Images/headerlogo.png'
import walltlogo from '../Images/walletlogo.png'



 /*  MAIN MAIN MAIN MAIN MAIN         */
var networkName = "CRO";

const networks = {
	CRO: {
		chainId: `0x${Number(338).toString(16)}`,
        chainName: "Cronos Testnet",
        nativeCurrency: {
          name: "Cronos Testnet",
          symbol: "TCRO",
          decimals: 18
        },
        rpcUrls: ["https://evm-t3.cronos.org/"],
        blockExplorerUrls: ["https://testnet.cronoscan.com/"]
      },
};

const changeNetwork = async ({ networkName, setError }) => {
	try {
	  if (!window.ethereum) throw new Error("No crypto wallet found");
	  await window.ethereum.request({
	    method: "wallet_addEthereumChain",
	    params: [
	      {
		...networks[networkName]
	      }
	    ]
	  });
	  
	} catch (err) {
	  console.log(err.message);
	}
      };



function Header() {

    //const classes = useStyles();
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);
	const data = useSelector((state) => state.data);
	const [feedback, setFeedback] = useState("Reveal What Your Destiny Holds!");
	const [claimingNft, setClaimingNft] = useState(false);

    const [selectWalletPopup, setSelectWalletPopup] = useState(false);

   	const [counter, setCounter] = useState(1);
	
	var accountSelected = "";

	const getData = () => {
		if (blockchain.account !== "" && blockchain.CGBSmartContract !== null) {
			dispatch(fetchData(blockchain.account));

			accountSelected = blockchain.account;

            document.getElementById('accountHolder').textContent = shorten(accountSelected);
        }
    };

    const shorten = (str) => {
        if (str.length < 10) return str;
        return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
      }
    
    const [error, setError] = useState();

    const handleNetworkSwitch = async () => {
        //alert("metamask");
        blockchain.CGBSmartContract = null;
        setError();
        await changeNetwork({ networkName, setError });
	    dispatch(connectMM());
        getData();
    };

    const handleDefiConnect = async () => {
        blockchain.CGBSmartContract = null;
        setError();
	    dispatch(connectWC());
        getData();
    }
    


	const networkChanged = (chainId) => {
	console.log({ chainId });
    };
    
    const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};

	useEffect(() => {

		//getBrowser();
		getData();
    }, [blockchain.account]);

	return (

      <header>
      
        <div style={{ background:"#d8d8d8", display:"flex" , justifyContent:"center" , paddingTop:"5px" , paddingBottom:"5px"}}>

            <img style={{ display:"inline", justifyContent:"center", paddingRight:"100px" }} src={headerlogo} height="50px" ></img>

          
          <div className='CWbutton' style={{display:"flex"  }} >
            
            <img src={walltlogo} height="45px" />

            <a onClick={ () => setSelectWalletPopup(true)} style={{paddingTop:"10px"}} >
              <span className='newFont wallButt' style={{fontSize: "10px", fontWeight: "700" }} id="accountHolder">
                CONNECTWALLET 
              </span>
            </a>

          </div>

        </div>
      



      
        <div className='whole-modal'>
           <SelectWalletModal trigger={selectWalletPopup} setTrigger={setSelectWalletPopup} handleNetworkSwitch={handleNetworkSwitch} handleDefiConnect={handleDefiConnect}></SelectWalletModal>
        </div>


      </header>  
	);
  }
  
  export default Header;
