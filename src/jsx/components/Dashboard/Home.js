import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import coin from "./../../../images/coin.png";
import axiosInstance, {
  getDetailsforDashboard,
} from "../../../services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import SwiperSlider from "../Swipers/SwiperSlider";
import BitXStaking from "../../../contractAbis/BitXStaking.json";
import BitXSwap from "../../../contractAbis/BitXGoldSwap.json";

import { ethers } from "ethers";
import { Logout } from "../../../store/actions/AuthActions";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
const Home = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [bxgavailable, setbxgavailable] = useState(null);
  const [bxgstacked, setbxgstacked] = useState(null);
  const [referralBonus, setreferralBonus] = useState(null);
  const [stakingreferralBonus, setStakingReferralBonus] = useState(null);
  const [totalEarning, settotalEarning] = useState(null);
  const [loader, setLoader] = useState(false);
  const state = useSelector((state) => state);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onsubmitTransfer = async () => {
    const logout = () => {
      dispatch(Logout(navigate));
    };

    let address = "";
    let signer = {};
    if (state.auth.isLoggedInFromMobile === "mobile") {
      const RPC_URLS = {
        1: "https://bsc-dataseed4.binance.org/",
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

    const staking = new ethers.Contract(
      BitXStaking.address,
      BitXStaking.abi,
      signer
    );

    const swap = new ethers.Contract(BitXSwap.address, BitXSwap.abi, signer);

    if (address !== state.auth.auth.walletaddress) {
      toast.error("Wrong account is selected, Logging Out", {
        position: "top-center",
        style: { minWidth: 180 },
      });
      setTimeout(logout, 1000);
      return;
    }

    try {
      const domain = {
        name: "StakingVoucher",
        version: "1.0",
        verifyingContract: BitXStaking.address,
        chainId: 56,
      };

      const types = {
        StakingVoucher: [
          { name: "currentAddress", type: "address" },
          { name: "newAddress", type: "address" },
          { name: "timestamp", type: "uint256" },
        ],
      };
      const timestamp = new Date().valueOf();

      const prices = ethers.utils.parseEther("0.01");
      let voucher = {
        currentAddress: state.auth.auth.walletaddress,
        newAddress: walletAddress,
        timestamp: timestamp,
      };

      const signature = await signer._signTypedData(domain, types, voucher);
      voucher = {
        currentAddress: state.auth.auth.walletaddress,
        newAddress: walletAddress,
        timestamp: timestamp,
        signature,
      };
      const tx = await (await staking.changeAddress(walletAddress)).wait();

      console.log(walletAddress, "tx1 walletaddress");
      const tx1 = await (await swap.changeAddress(walletAddress)).wait();
      if (tx.events && tx1.events) {
        let requestBody = {
          wallet_address: state.auth.auth.walletaddress,
          new_wallet: walletAddress,
        };

        const { data } = await axiosInstance
          .post("/api/profile/convert", requestBody)
          .catch((err) => {
            toast.error(err.response.data.message, {
              position: "top-center",
              style: { minWidth: 180 },
            });
          });

        if (data.status) {
          //logout
          toast.success(data.message, {
            position: "top-center",
            style: { minWidth: 180 },
          });
          setTimeout(logout, 1000);
        }
      }
    } catch (error) {
      console.log(error.reason);
      console.log(error);
    }
  };

  const FetchData = async () => {
    setLoader(true);
    try {
      const response = await getDetailsforDashboard(
        state.auth.auth.walletaddress
      );
      setbxgavailable(response.availableBXG);
      setbxgstacked(response.bxgStaked);
      settotalEarning(response.totalEarning);
      setreferralBonus(response.referalBonus);
      setStakingReferralBonus(response.stakingReferralBonus);
    } catch (err) {
      toast.error(err.message, {
        style: { minWidth: 180 },
        position: "top-center",
      });
    }
    setLoader(false);
  };

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "dark", label: "Dark" });
    FetchData();
  }, []);

  return (
    <>
      <Toaster />
      {loader === true ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card bubles">
                    <div className="card-body">
                      <div className="buy-coin  bubles-down">
                        <div>
                          <h2>{t("dashboard_header_card_description")}</h2>
                          <Link to={"/buy"} className="btn btn-primary">
                            {t("dashboard_header_card_buy")}
                          </Link>
                        </div>
                        <div className="coin-img">
                          <img src={coin} className="img-fluid" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-xl-4">
                  <div className="card bubles">
                    <div className="card-body">
                      <div className="">
                        <div
                          style={{
                            //center
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          <h2>{t("Transfer")}</h2>
                          <input
                            value={walletAddress}
                            type="text"
                            className="col-10 form-control my-4"
                            placeholder="Enter Address"
                            onChange={(e) => setWalletAddress(e.target.value)}
                          />

                          <Link
                            onClick={onsubmitTransfer}
                            className="btn btn-primary">
                            {t("Transfer")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <SwiperSlider
                  bxgavailable={bxgavailable}
                  bxgstacked={bxgstacked}
                  totalEarning={totalEarning}
                  referralBonus={referralBonus}
                  stakingreferralBonus={stakingreferralBonus}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Home;
