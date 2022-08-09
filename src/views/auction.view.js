import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fromYoctoToNear,
  getNearAccount,
  ext_view,
  ext_call
} from "../utils/near_interaction";
import dayjs from 'dayjs';
import BidModal from "../components/bidModal.component";

import { useTranslation } from "react-i18next";

function AuctionFunction(props) {
  const [auction, setAuction] = useState({});
  const [auctionBids, setAuctionBids] = useState([]);
  const [account, setAccount] = useState("");
  const [t, i18n] = useTranslation("global")
  //setting state for the offer modal
  const [bidModal, setBidModal] = useState({
    show: false,
  });
  const params = useParams();
  useEffect(() => {
    (async () => {

      console.log('props', props);
      console.log('token', params.tokenid);
      let contract = process.env.REACT_APP_CONTRACT_AUCTIONS;
      let account = await getNearAccount();
      let payload = {};

      payload = {
        auction_id: parseInt(params.tokenid)
      }

      let auction = await ext_view(contract, 'get_nft_auction', payload);
      let auctionBids = await ext_view(contract, 'get_bid_auction', payload);
      console.log('auction', auction);
      console.log('auction_bids', auctionBids);
      setAuction({ ...auction, auction });
      if (auctionBids != null) setAuctionBids(auctionBids.reverse())
      setAccount(account);

    })();
  }, []);

  async function makeAnOffer() {
    console.log("Make a offer")
    setBidModal({
      show: true,
      message: "HAZ UNA OFFERTA",
      loading: false,
      disabled: false,
      change: setBidModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function processCancelBidOffer() {
    if(auctionBids.length == 0){
      /*No hay oferta y cancela el owner*/
      console.log("account nft_owner",auction.nft_owner);
      console.log("account nft_owner",auction);

      let payload = {
        auction_id: auction.id
      }
      ext_call(process.env.REACT_APP_CONTRACT_AUCTIONS, 'withdraw_nft_owner', payload, 300000000000000, 1);
    } else {
      /*Hay oferta y cancela el bidder*/
      console.log("account bidder_id",auction.bidder_id);
      let payload = {
        auction_id: auction.id
      }
      ext_call(process.env.REACT_APP_CONTRACT_AUCTIONS, 'withdraw_nft_auctioner', payload, 300000000000000, 1);
      
    }
  }

  async function processClaimNFT() {
    console.log("processClaimNFT")

    console.log("account nft_owner",auction.nft_owner);
    console.log("account nft_owner",auction);

    let payload = {
      auction_id: auction.id
    }

    ext_call(process.env.REACT_APP_CONTRACT_AUCTIONS, 'claim_nft_winner', payload, 300000000000000, 1)

  }



  return (
    <section className="text-gray-600 body-font  dark:bg-darkgray ">
      <div className="flex flex-col text-center w-full">
        <div className="container px-5 pt-5 mx-auto asda">
          <div className="flex flex-col text-center w-full">
            <div className="w-full  px-2 py-5 sm:px-0">
              <div className="w-full p-4  " key={1}>

                <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                  <div className="trending-token w-full rounded-20 ">
                    <div className=" bg-white rounded-20 h-auto  flex">
                      <div className="p-6 pt-3 pb-3  w-1/3">
                        <img
                          className="object-contain object-center rounded-xlarge h-[9rem]  bg-center"
                          src={`https://nativonft.mypinata.cloud/ipfs/${auction.nft_media}`}
                          alt={1}
                        />
                      </div>
                      <div className=" pb-3 p-6 pt-3 flex flex-col  w-2/3">
                        <div className="capitalize text-black text-sm  text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold text-center"></div>
                        <div className="flex justify-around pt-2 flex-col">

                          <div className="text-black font-raleway font-normal w-full text-base text-left"><span className="font-bold"></span>{auction.description}</div>
                          <div className="flex w-full text-left">
                            <div className="text-black text-sm font-raleway font-normal  w-1/3"><span className="font-bold">NFT ID: </span>{auction.nft_id}</div>
                            <div className="text-black text-sm font-raleway font-normal  w-2/3"><span className="font-bold">Propietario: </span>{auction.nft_owner}</div>
                          </div>
                          <div className="flex">
                            <div className="w-1/3">
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Termina en: </span>{dayjs.unix(auction.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss")} jsaas{ } </div>
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Status </span>{auction.status}</div>
                              <div className="text-black  text-lg  font-raleway font-normal   text-left"><span className="font-bold text-sm">Precio base </span>{auction.auction_base_requested ? (fromYoctoToNear(auction.auction_base_requested)) : null}  Ⓝ</div>
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Contrato </span>{auction.nft_contract}</div>
                            </div>
                            <div className="w-2/3  rounded-xlarge ">
                              {/*Auction active*/
                              (dayjs.unix(auction.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss") > dayjs(new Date()).format("DD/MMM/YYYY HH:mm:ss") ? 
                                <>
                                {/*There is active offers for this auctions*/
                                  (auctionBids.length == 1 ?
                                  <div className="flex flex-col py-2 border rounded-xlarge">
                                    <div className="flex justify-around">
                                      <span className="text-black   font-raleway text-sm"><span className="font-bold">{t("Detail.actualBid")}</span> {fromYoctoToNear(auction.auction_payback)}  Ⓝ</span>
                                      <span className=" text-black  pr-3 font-raleway text-sm"><span className="font-bold">OFERTANTE</span> {auction.bidder_id}</span>
                                    </div>
                                    {
                                    (account==auction.nft_owner ?
                                      /*The current account is the nft owner*/
                                      <div className="w-full p-2">
                                        <button
                                          className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0  focus:outline-none hover:bg-yellow   font-raleway text-sm rounded-xlarge p-2 m-2"
                                          onClick={async () => { processCancelBidOffer() }}>
                                          <span className="font-raleway">{t("Detail.cancelBid")}</span>
                                        </button>
                                      </div>
                                      :
                                      <>
                                       {/*The current account is the bidder*/
                                       (account==auction.bidder_id ? 
                                        <div className="w-full flex ">
                                          <button
                                            className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0 focus:outline-none hover:bg-yellow   font-raleway text-sm rounded-xlarge p-2 m-2"
                                            onClick={async () => { processCancelBidOffer() }}>
                                            <span className="font-raleway">{t("Detail.cancelBid")}</span>
                                          </button>
                                        </div>
                                        :
                                        ""
                                       )}
                                      </>
                                    )}
                                  </div> : 
                                  <>
                                  {/*There is NOT active offers for this auctions*/}
                                  {(account==auction.nft_owner  && auction.status != 'Canceled' ?
                                      /*The current account is the nft owner*/
                                      <div className="w-full p-2">
                                        <button
                                          className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0  focus:outline-none hover:bg-yellow   font-raleway text-sm rounded-xlarge p-2 m-2"
                                          onClick={async () => { processCancelBidOffer() }}>
                                          <span className="font-raleway">CANCEL THIS AUCTION</span>
                                        </button>
                                      </div>
                                      :
                                      <>
                                      </>)
                                    }
                                  </>
                                )}
                                </> :
                                <>
                                {/*Auction Finished*/ /*There is active offers for this auction*/
                                (auctionBids.length == 1 ? 
                                <>
                                {account == auction.bidder_id && auction.status != 'Claimed' ? <>
                                  <div className="flex flex-col py-2 border rounded-xlarge">
                                    <div className="flex justify-around">
                                      <div className="text-black   font-raleway text-sm"><span className="font-bold">AUCTION ENDED! CLAIM YOUR NFT!</span></div>
                                    </div>
                                    <div className="w-full p-2">
                                        <button
                                          className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0  focus:outline-none hover:bg-yellow   font-raleway text-sm rounded-xlarge p-2 m-2"
                                          onClick={async () => { processClaimNFT() }}>
                                          <span className="font-raleway">CLAIM NFT</span>
                                        </button>
                                      </div>
                                  </div>
                                </> : "" }
                                </> 
                                : 
                                        <>
                                          {/*There is NOT offers for this auction*/
                                            account == auction.nft_owner && auction.status != 'Canceled'?
                                              <div className="flex flex-col py-2 border rounded-xlarge">
                                                <div className="flex justify-around">
                                                  <div className="text-black   font-raleway text-sm"><span className="font-bold">THIS AUCTION ALREADY FINISHED, PLEASE CANCEL IT</span></div>
                                                </div>
                                                <div className="w-full p-2">
                                                  <button
                                                    className="w-full content-center justify-center text-center font-bold text-white bg-yellow2 border-0  focus:outline-none hover:bg-yellow   font-raleway text-sm rounded-xlarge p-2 m-2"
                                                    onClick={async () => { processCancelBidOffer() }}>
                                                    <span className="font-raleway">CANCEL AUCTION</span>
                                                  </button>
                                                </div>
                                              </div>
                                              : ""
                                          }
                                        </>)}
                                </>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center w-full">
            <div className="w-full  px-2  sm:px-0">
              <div className="w-full " key={1}>
                <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                  <div className="trending-token w-full rounded-20 ">
                    <div className="flex justify-between">
                      <div className="text-white font-bold my-auto">
                        OFERTAS Realizadas
                      </div>

                      {account!=auction.nft_owner && dayjs.unix(auction.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss") > dayjs(new Date()).format("DD/MMM/YYYY HH:mm:ss") ? 
                      <div className="flex flex-row flex-wrap justify-around text-center">
                        <button
                          className={`w-full m-2 lg:w-40 content-center justify-center text-center  text-white bg-yellow2 border-0 py-2 px-6 focus:outline-none hover:bg-yellow rounded-xlarge font-raleway font-medium`}
                          onClick={async () => {
                            makeAnOffer();
                          }}
                        >
                          OFERTAR
                        </button>
                      </div> : ""}
                    </div>
                    <div className=" bg-white rounded-20 h-auto flex flex-col">
                      {auctionBids.length != 0 ? auctionBids.map((bid, key) => {
                        return (
                          <div className="flex  flex-col">
                            {key == 0 ? <>
                              <div className="flex">
                                <p className="font-bold text-center text-darkgray border-b border-solid border-gray-700 w-1/2">bid_amount</p>
                                <p className="font-bold text-center text-darkgray border-b border-solid border-gray-700 w-1/2">bidder_id</p>
                              </div>
                              <div className="flex">
                                <p className="border-b border-solid border-gray-700 w-1/2 text-darkgray">{fromYoctoToNear(bid.bid_amount)} Ⓝ{ }</p>
                                <p className="border-b border-solid border-gray-700 w-1/2 text-darkgray">{bid.bidder_id}</p>
                              </div>
                            </> :
                              <>
                                <div className="flex">
                                  <p className="border-b border-solid border-gray-700 w-1/2 text-darkgray">{fromYoctoToNear(bid.bid_amount)} Ⓝ{ }</p>
                                  <p className="border-b border-solid border-gray-700 w-1/2 text-darkgray">{bid.bidder_id}</p>
                                </div>
                              </>
                            }

                          </div>
                        )
                      }) : "There is no current Offers for this auction"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BidModal {...bidModal} {...auction} />
    </section>
  );
}
export default AuctionFunction;
          