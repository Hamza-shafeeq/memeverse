import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import bxgicon from "../../../icons/buy and sell/tokenbxg.png";
import usdicon from "../../../icons/buy and sell/usdtt.png";
import usdt from "../../../contractAbis/USDT.json";
import bitXSwap from "../../../contractAbis/BitXGoldSwap.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import axiosInstance, {
  getChangedValue,
} from "../../../services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loader/Loader";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Logout } from "../../../store/actions/AuthActions";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { ReactComponent as EthIcon } from "../../../images/svg/eth.svg";

const Buy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setloader] = useState(false);
  const [value, setValue] = useState(0);
  const [bxgvalue, setBxgvalue] = useState(0);
  const [totalUsd, setTotalUsd] = useState(bxgvalue * value);

  const state = useSelector((state) => state);

  const { changeBackground } = useContext(ThemeContext);

  const FetchData = async () => {
    setloader(true);
    try {
      const value = await getChangedValue();

      if (value) {
        setValue(value);
      }
      setloader(false);
    } catch (err) {
      toast.error("Server Error", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setloader(false);
    }
  };

  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();
  }, []);

  const handleBuy = async () => {
    const logout = () => {
      dispatch(Logout(navigate));
    };

    let address = "";
    let signer = {};
    if (state.auth.isLoggedInFromMobile === "mobile") {
      const RPC_URLS = {
        1: "https://bsc-dataseed1.binance.org/",
      };
      const provider = new WalletConnectProvider({
        rpc: {
          1: RPC_URLS[1],
        },
        qrcode: true,
      });
      const accounts = await provider.enable();
      const library = new Web3Provider(provider, "any");
      signer = library.getSigner();
      address = accounts[0];
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const addresses = await provider.send("eth_requestAccounts", []);
      address = addresses[0];
    }
    if (address !== state.auth.auth.walletaddress) {
      toast.error("Wrong account is selected, Logging Out", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setTimeout(logout, 1000);
      return;
    }

    const swap = new ethers.Contract(bitXSwap.address, bitXSwap.abi, signer);
    const usdtToken = new ethers.Contract(usdt.address, usdt.abi, signer);

    setloader(true);
    if (bxgvalue === 0) {
      toast.error("Please enter a valid amount", {
        position: "top-center",
        style: { minWidth: 180 },
      });
    } else {
      try {
        const amount = ethers.utils.parseEther(bxgvalue);
        const value = await usdtToken.allowance(
          state.auth.auth.walletaddress,
          bitXSwap.address
        );
        if (value < amount) {
          const amountApprove = ethers.utils.parseEther(
            "100000000000000000000000000000000000000000"
          );
          await (
            await usdtToken.approve(bitXSwap.address, amountApprove)
          ).wait();
        }
        const tx = await (await swap.swapBuy(amount)).wait();
        if (tx.events) {
          var wasAdded = {};
          try {
            if (state.auth.isLoggedInFromMobile === "mobile") {
              wasAdded = await state.auth.provider.request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC20",
                  options: {
                    address: "0x4BBDE1FD97121B68c882fbAfA1C6ee0099c2Eb8b",
                    symbol: "BXG",
                    decimals: 18,
                    image: `https://i.ibb.co/H7P6tFL/Whats-App-Image-2023-02-21-at-11-50-44-PM.jpg`,
                  },
                },
              });
            } else if (state.auth.isLoggedInFromMobile === "laptop") {
              wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC20",
                  options: {
                    address: "0x4BBDE1FD97121B68c882fbAfA1C6ee0099c2Eb8b",
                    symbol: "BXG",
                    decimals: 18,
                    image: `https://i.ibb.co/H7P6tFL/Whats-App-Image-2023-02-21-at-11-50-44-PM.jpg`,
                  },
                },
              });
            }
            if (wasAdded) {
              toast.success("Token added in metamask successfully", {
                position: "top-center",
                style: { minWidth: 180 },
              });
            }
          } catch (error) {
            toast.error(error.message, {
              position: "top-center",
              style: { minWidth: 180 },
            });
          }
          toast.success(tx.blockHash, {
            position: "top-center",
            style: { minWidth: 180 },
          });

          const requestBody = {
            wallet_address: state.auth.auth.walletaddress,
            bxg: bxgvalue,
            usdt: totalUsd,
            blockhash: tx.blockHash,
          };
          const { data } = await axiosInstance
            .post("/api/bxg/", requestBody)
            .catch((err) => {
              toast.error(err.response.data.message, {
                position: "top-center",
                style: { minWidth: 180 },
              });
            });
          if (data === "Purchasing Successfull.") {
            toast.success(data, {
              position: "top-center",
              style: { minWidth: 180 },
            });
          }
        } else {
          toast.error("Transaction Failed", {
            position: "top-center",
            style: { minWidth: 180 },
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.reason, {
          position: "top-center",
          style: { minWidth: 180 },
        });
        //console.log(error);
      }
    }
    setloader(false);
  };

  const handleChange = (e) => {
    setBxgvalue(e.target.value);
  };

  useEffect(() => {
    setTotalUsd(bxgvalue * value);
  }, [bxgvalue]);
  const currencyOptions = [
    {
      value: "usdt",
      label: (
        <>
          <img
            src={usdicon}
            width="20"
            height="20"
            alt="usdt logo"
            className=""
          />
          &nbsp;USDT
        </>
      ),
    },
    {
      value: "eth",
      label: (
        <>
          <EthIcon width={20} height={20} />
          &nbsp;ETH
        </>
      ),
    },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      marginLeft: "-15px",
      width: 115, // Customize the width here
      height: "3rem",
      borderRadius: "0.625rem",
      border: "1px solid #3A2D60",
      backgroundColor: "#15073A", // Customize the background color here
      color: "#a9a9a9 !important",
      fontSize: "1rem",
    }),

    menu: (provided) => ({
      ...provided,
      marginLeft: "-15px",
      color: "#a9a9a9 !important",
      backgroundColor: "#15073A", // Customize the background color of the dropdown list here
    }),
  };

  return (
    <>
      <Toaster />
      {loader === true ? (
        <Loader />
      ) : (
        <div
          className="row "
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <div className="col-xl-6" style={{ height: "100%" }}>
            <div className="card">
              <div className="card-body pb-2">
                <br></br>
                <h1 className="text-center no-border font-w600 fs-60 mt-2">
                  <span className="text-warning">{t("buy_header")}</span>{" "}
                  {t("buy_sell_header_description")}
                  <br />
                </h1>
                <br></br>
                <br></br>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="text-center mt-3 row justify-content-center">
                      <div className="col-xl-12 justify-content-center">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              onChange={handleChange}
                              type="text"
                              className="form-control mb-3"
                              name="value"
                              placeholder=""
                              value={bxgvalue}
                            />
                          </div>
                          <div className="col-2 col-xl-2 col-sm-2 justify-content-right">
                            <div className="row">
                              <div
                                style={{ color: "darkgrey" }}
                                type="text"
                                className="custom-react-select form-control mb-3"
                              >
                                <img
                                  src={bxgicon}
                                  width="35"
                                  height="35"
                                  alt="bxg logo"
                                />
                                MEME
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-12">
                        <div className="row justify-content-center">
                          <div className="col-6 col-xl-6 col-sm-6">
                            <input
                              disabled={true}
                              type="text"
                              className="form-control mb-3"
                              value={totalUsd}
                              name="value"
                              placeholder="12"
                            />
                          </div>
                          <div className="col-2 col-xl-2 col-sm-2 col-md-2">
                            <div className="row">
                              <Select
                                options={currencyOptions}
                                styles={customStyles}
                              />

                              {/* <div
                                style={{ color: "darkgrey" }}
                                type="text"
                                className="custom-react-select form-control mb-3"
                              >
                                <img
                                  src={usdicon}
                                  width="25"
                                  height="25"
                                  alt="usdt logo"
                                  className=""
                                />
                                USDT
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>

                    <div className="text-center mt-4 mb-4">
                      <Link
                        onClick={handleBuy}
                        className="btn btn-warning mr-0 "
                      >
                        {t("buy_button")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Buy;
