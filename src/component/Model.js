import React from "react";
import Button from "@mui/material/Button";
import '../styles/modal.css';

import metamask from '../assets/images/metamask.png';
import defi from '../assets/images/defi.png';

export default function SelectWalletModal(props) {
	const { handleNetworkSwitch, handleDefiConnect } = props;
	return (props.trigger)? (
		<div>
		<p className='written' >Please Select Wallet</p>
	  <div className="two-wallets" >
		  <Button style={{  padding:"5px" }}
		    onClick={() => {
			handleNetworkSwitch();
			    props.setTrigger(false)
		    }}
		    w="100%">
		      <span className="wallet-meta" > <img className="wall-img" style={{width:"30px", height:"auto", paddingRight:"4px",}} src={metamask}></img> Metamask</span>
		  </Button>
		  <Button style={{  padding:"5px"}}
		    variant="outline"
		    onClick={() => {
			handleDefiConnect();
			    props.setTrigger(false)
		    }}
		    w="100%">
		      <span className="wallet-defi" > <img className="wall-img" style={{width:"30px", height:"auto", paddingRight:"4px",}} src={defi}></img> Defi-Wallet</span>
		</Button>

		<div className="CloseButt" >
		<Button style={{fontSize:"22px" , fontWeight:"900" , color:"#06d6a0"}} onClick={() => props.setTrigger(false)}>X</Button>
		</div>

		</div>
		</div>
	) : "";
      }
      