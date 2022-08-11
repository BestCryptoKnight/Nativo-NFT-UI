import  React, {useState, useEffect} from "react";
import {
  getNearAccount,
  ext_view,
  fromYoctoToNear
} from "../utils/near_interaction";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";


function Auctions() {

  const [t, i18n] = useTranslation("global")
  const [auctions, setAuctions] = useState({
    total_active: 0,
    all: [],
    hasMore: true,
    lastIDfetched: -1
  });


  useEffect(() => {
    (async () => {
      let contract = process.env.REACT_APP_CONTRACT_AUCTIONS;
      let account = await getNearAccount();
      let payload = {};

      payload = {
        from_index: '0',
        limit: 5
      }
      let all_auctions = await ext_view(contract, 'get_all_nfts_for_auction', payload);

      let total = await ext_view(contract, 'get_auctions_stats', payload);

      setAuctions({...auctions, all: all_auctions, total_active: total.total_auctions_active, lastIDfetched: all_auctions!=0 ? all_auctions[all_auctions.length - 1].id : 0});
    })();
  }, []);

  let fetchMoreAuctions = async () => {
    let contract = process.env.REACT_APP_CONTRACT_AUCTIONS;
    let total = await ext_view(contract, 'get_last_auction');
    if(auctions.lastIDfetched+1 <= total-1){
      let contract = process.env.REACT_APP_CONTRACT_AUCTIONS;
      let account = await getNearAccount();
      let payload = {};

      payload = {
        from_index: (auctions.lastIDfetched+1).toString(),
        limit: 5
      }
      let all_auctions = await ext_view(contract, 'get_all_nfts_for_auction', payload);
      let total = await ext_view(contract, 'get_auctions_stats', payload);
      setAuctions({...auctions, all: auctions.all.concat(all_auctions), total_active: total.total_auctions_active, lastIDfetched: all_auctions!=0 ? all_auctions[all_auctions.length - 1].id : 0});
    } else {
      setAuctions({...auctions, hasMore:false})
    }
  }
      

  
  return (
    <section className="text-gray-600 body-font  dark:bg-darkgray ">
      <div className="flex flex-col text-center w-full">
        <div className="w-full h-[30px] flex my-8 justify-center">
          <p className="text-3xl lg:text-6xl font-black   dark:text-white  bg-darkgray m-0 px-10 font-raleway uppercase self-center">
          {t("auctions.au_title")}
          </p>
        </div>
        <p className="lg:w-full leading-relaxed text-base bg-white text-darkgray font-raleway">
        {t("auctions.au_subtitle")}
       </p>
      </div>
        <div className="container px-5 pt-5 mx-auto asda">
          <div className="flex flex-col text-center w-full">
            <div className="w-full  px-2 py-5 sm:px-0">
           {auctions.all.length !=0 ? 
           <InfiniteScroll
            dataLength={auctions.all}
            next={fetchMoreAuctions}
            hasMore={auctions.hasMore}
            loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2"> {t("auctions.au_loading")}</h1>}
            endMessage={
              <p className="text-center w-full py-10 text-xl text-yellow2">
                <b>{t("auctions.au_finish")}</b>
              </p>
            }
            className={"flex flex-wrap md:px-[40px]"}
          >
            {auctions.all.map((nft, key) => {
              return (
                <div className="w-full p-4  " key={key}>
                  <a
                    href={"/auction/" + nft.id}
                  >
                    <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                      <div className="trending-token w-full rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                        <div className=" bg-white rounded-20 h-[365px] md:h-[170px] flex flex-col md:flex-row">
                          <div className="p-6 pt-3 pb-3 w-full md:w-1/3 flex ">
                            <img
                              className="object-contain object-center rounded-xlarge h-[9rem]  bg-center m-auto"
                              src={`https://nativonft.mypinata.cloud/ipfs/${nft.nft_media}`}
                              alt={nft.description}
                            />
                          </div>
                          <div className=" pb-3 p-6 md:pt-3 flex flex-col w-full md:w-1/3">
                            <div className="capitalize text-black text-sm    font-raleway font-bold text-center"></div>
                            <div className="flex justify-around pt-2 flex-col">
                            
                              <div className="text-black font-raleway font-normal w-full text-base text-left text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold"></span>{nft.description}</div>
                              <div className="flex w-full flex-col md:flex-row text-left">
                                <div className="text-black text-sm font-raleway font-normal w-full md:w-1/3 text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold">ID </span> {nft.nft_id}</div>
                                <div className="text-black text-sm font-raleway font-normal w-full md:w-2/3 text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold">{t("auction.au_owner")} </span> {nft.nft_owner}</div>
                              </div>
                              <div className="text-black text-sm font-raleway font-normal text-left text-ellipsis overflow-hidden whitespace-nowrap "><span className="font-bold">{t("auction.au_end")} </span>{dayjs.unix(nft.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss")}</div>
                              <div className="text-black text-sm font-raleway font-normal text-left  text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold">{t("auction.au_status")} </span>{nft.status}</div>
                              <div className="text-black  text-lg  font-raleway font-normal   text-left text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold text-sm">{t("auction.au_price")} </span>{fromYoctoToNear(nft.auction_base_requested)} Ⓝ</div>
                              <div className="text-black text-sm font-raleway font-normal text-left  text-ellipsis overflow-hidden whitespace-nowrap"><span className="font-bold">{t("auction.au_contract")} </span>{nft.nft_contract}</div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                    </a>
                </div>
              )
            })}
            </InfiniteScroll>
           : <>{t("auction.au_notAvailable")}</> }
            </div>
          </div>
          </div>
      </section>
  );
}

export default Auctions;
