import React, { useState, useEffect } from "react";
import "./box.css";
import eth from "../../../Assets/binance.png";
import usdt from "../../../Assets/usdt.svg";
import { abi, address } from "../../../contract";
import {
  selectedStyle,
  unSelectedStyle,
  pSelectedStyle,
  pUnSelectedStyle,
} from "./styles";
import Web3 from "web3";
import { usdtAbi, usdtAddress } from "../../../usdt";

const Box = ({ isConnected, ConnectButton }) => {
  const [ethValue, setEthValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [payway, setPayway] = useState("eth");
  const [isChecked, setIsChecked] = useState(false);
  let giftcode;
  const [targetDate, setTargetDate] = useState("2024-07-17T08:32");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const countDownDate = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleChange = (e) => {
    setTargetDate(e.target.value);
  };

  function changeToEther() {
    setPayway("eth");
    setTokenValue(0);
    setEthValue(0);
    console.log(payway);
  }

  function changeToUsdt() {
    setPayway("usdt");
    setEthValue(0);
    setTokenValue(0);
    console.log(payway);
  }

  // Sync inputs
  async function syncInputs(event) {
    const { id, value } = event.target;
    const ethPrice = await getEthUsdtPrice();

    if (id === "eth") {
      console.log("ETH Value:", value);
      payway === "usdt"
        ? setTokenValue(roundToDecimal(value * 500, 1))
        : setTokenValue(roundToDecimal(value * ethPrice * 500, 1));
      setEthValue(value);
    } else if (id === "token") {
      console.log("Token Value:", value);
      payway === "usdt"
        ? setEthValue(roundToDecimal(value / 500, 2))
        : setEthValue(roundToDecimal(value / (ethPrice * 500), 4));
      setTokenValue(value);
    }
  }

  function changeCheck() {
    setIsChecked(!isChecked);
  }

  function roundToDecimal(num, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
  }

  async function getEthUsdtPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,tether&vs_currencies=usd"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const ethPriceInUsd = data.binancecoin.usd;

      return ethPriceInUsd;
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }

  async function buyToken() {
    let web3 = new Web3(window.ethereum);
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(abi, address);
      const USDTContract = new web3.eth.Contract(usdtAbi, usdtAddress);

      let indexGiftcode = 0;
      if (giftcode == "FSH-BINGX") indexGiftcode = 1;
      else if (giftcode == "FSH-BITCOIN") indexGiftcode = 2;
      if (payway === "eth") {
        await contract.methods
          .buyTokensWithEther(indexGiftcode)
          .send({ from: accounts[0], value: ethValue * 1e18 });
      } else {
        await USDTContract.methods
          .approve(address, ethValue * 1e18)
          .send({ from: accounts[0] });
        await contract.methods
          .buyTokensWithUSDT(ethValue * 500, indexGiftcode)
          .send({ from: accounts[0] });
      }
    } catch (e) {
      console.error("Execute Contract: ", e);
    }
  }

  return (
    <div className="box">
      <div className="description">
        <p className="BUY-NOW-BEFOR-PRICE-RISE">BUY NOW BEFOR PRICE RISE</p>
        <div className="countdown">
          <div className="days-c">
            <p>DAYS</p>
            <div className="days">{countdown.days}</div>
          </div>
          <div className="hours-c">
            <p>HOURS</p>
            <div className="hours">{countdown.hours}</div>
          </div>
          <div className="minuts">
            <p>MINUTS</p>
            <div className="minuts">{countdown.minutes}</div>
          </div>
          <div className="seconds">
            <p>SECONDS</p>
            <div className="seconds">{countdown.seconds}</div>
          </div>
        </div>
        <p className="price">1 FISHO = $0.002</p>
      </div>
      <div className="buttons">
        <div className="payment-way">
          <button
            className="eth"
            id="eth"
            style={payway === "eth" ? selectedStyle : unSelectedStyle}
            onClick={changeToEther}
          >
            <img src={eth} alt="ETH" onClick={changeToEther} />
            <p
              onClick={changeToEther}
              style={payway === "eth" ? pSelectedStyle : pUnSelectedStyle}
            >
              BSC
            </p>
          </button>
          <button
            className="usdt"
            id="usdt"
            style={payway === "usdt" ? selectedStyle : unSelectedStyle}
            onClick={changeToUsdt}
          >
            <img src={usdt} alt="USDT" onClick={changeToUsdt} />
            <p
              onClick={changeToUsdt}
              style={payway === "usdt" ? pSelectedStyle : pUnSelectedStyle}
            >
              USDT
            </p>
          </button>
        </div>
        <div className="input">
          <div className="pay">
            <p className="eth-you-pay">
              {payway === "eth" ? "BSC you pay" : "USDT you pay"}
            </p>
            <input
              type="number"
              className="eth-input"
              placeholder="0"
              id="eth"
              value={ethValue}
              onInput={(e) => {
                console.log("ETH Input Changed", e.value);
                syncInputs(e);
              }}
            />
            <img src={payway === "eth" ? eth : usdt} />
          </div>
          <div className="receive">
            <p className="you-receive">FISHO you receive</p>
            <input
              type="number"
              className="receive-input"
              placeholder="0"
              id="token"
              value={tokenValue}
              onInput={(e) => {
                console.log("Token Input Changed");
                syncInputs(e);
              }}
            />
          </div>
        </div>
        {isConnected ? (
          <div className="pay-container">
            <div className="gift-div">
              <p className="gift-code">I have referral code</p>{" "}
              <input
                type="checkbox"
                className="check-mark"
                onChange={changeCheck}
              />
            </div>
            {isChecked ? (
              <div className="gift-container">
                <p className="gift-bonus">Enter a referral code</p>
                <input type="text" className="gift-input" value={giftcode} />
              </div>
            ) : (
              <></>
            )}
            <button className="buy" onClick={buyToken}>
              BUY NOW
            </button>
          </div>
        ) : (
          <div className="connect-wallet-container">{ConnectButton}</div>
        )}
      </div>
    </div>
  );
};

export default Box;
