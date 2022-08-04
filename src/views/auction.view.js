import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fromYoctoToNear,
  getNearAccount,
  ext_view
} from "../utils/near_interaction";
import dayjs from 'dayjs';
import BidModal from "../components/bidModal.component";

function AuctionFunction(props) {
  const [auction, setAuction] = useState({});
  const [auctionBids, setAuctionBids] = useState([]);
  const [account, setAccount] = useState("");
   //setting state for the offer modal
   const [bidModal, setBidModal] = useState({
    show: false,
  });
  const params = useParams();
  useEffect(() => {
    (async () => {

      console.log('props',props);
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
      setAuction({...auction, auction});
      if(auctionBids!=null) setAuctionBids(auctionBids.reverse())
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

  return (
    <section className="text-gray-600 body-font  dark:bg-darkgray ">
      <div className="flex flex-col text-center w-full">
        <div className="container px-5 pt-5 mx-auto asda">
          <div className="flex flex-col text-center w-full">
            <div className="w-full  px-2 py-5 sm:px-0">
              <div className="w-full p-4  " key={1}>

                <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                  <div className="trending-token w-full rounded-20 ">
                    <div className=" bg-white rounded-20 h-[250px] md:h-[170px] flex">
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
                          <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Termina en: </span>{dayjs.unix(auction.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss")}</div>
                          <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Status </span>{auction.status}</div>
                          <div className="text-black  text-lg  font-raleway font-normal   text-left"><span className="font-bold text-sm">Precio base </span>{auction.auction_base_requested ? (fromYoctoToNear(auction.auction_base_requested)) : null}  Ⓝ</div>
                          <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Contrato </span>{auction.nft_contract}</div>
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

                      {account!=auction.nft_owner ? 
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
