import  React, {useState, useEffect} from "react";
import {
  getNearAccount,
  ext_view,
  fromYoctoToNear
} from "../utils/near_interaction";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from 'dayjs';



function Auctions() {

  const [auctions, setAuctions] = useState({
    total_active: 0,
    all: [],
    hasMore: true
  });

  const test_active = [
    {
      id: 7,
      nft_owner: 'alexiaab.testnet',
      nft_contract: 'minterv2.nativo-minter.testnet',
      nft_id: '74',
      nft_media: 'QmPNAVeDgQcWzXpC4v3Vzzyg7DpAspHzXUxeVTJwAof1gj',
      description: 'list a new nft for Auction',
      auction_base_requested: '100000000000000000000000',
      auction_payback: '100000000000000000000000',
      status: 'Published',
      submission_time: 1658885706038073600,
      auction_time: null,
      auction_deadline: 1658886066038073600,
      bidder_id: null
    }
  ];
  useEffect(() => {
    (async () => {
      let contract = process.env.REACT_APP_CONTRACT_AUCTIONS;
      let account = await getNearAccount();
      let payload = {};

      payload = {
        from_index: '0',
        limit: 50
      }
      let all_auctions = await ext_view(contract, 'get_nfts_for_auction', payload);
      console.log('aaaaaaaaaaaa',all_auctions);
      let total = await ext_view(contract, 'get_auctions_stats', payload);
      console.log('total',total);
      setAuctions({...auctions, all: all_auctions, total_active: total.total_auctions_active});
    })();
  }, []);

  let fetchMoreAuctions = async () => {

    setAuctions({...auctions, hasMore:false})
  }
      

  const FinalDate =  (date)=>{
    console.log(dayjs(date, ["YYYY", "YYYY-MM-DD"], 'es', true));
    return dayjs(date, ["YYYY", "YYYY-MM-DD"], 'es', true);
  }
  
  return (
    <section className="text-gray-600 body-font  dark:bg-darkgray ">
      <div className="flex flex-col text-center w-full">
        <div className="lg:w-full h-[30px] flex my-8 justify-center">
          <h1 className="sm:text-3xl lg:text-6xl font-black title-font  dark:text-white  bg-darkgray m-0 px-10 font-raleway uppercase self-center">
            subastas ALV
          </h1>
        </div>
        <p className="lg:w-full leading-relaxed text-base bg-white text-darkgray font-raleway">
          subastas ALV x2
        </p>

      </div>
        <div className="container px-5 pt-5 mx-auto asda">
          <div className="flex flex-col text-center w-full">
            <div className="w-full  px-2 py-5 sm:px-0">
            <InfiniteScroll
            dataLength={auctions.all}
            next={fetchMoreAuctions}
            hasMore={auctions.hasMore}
            loader={<h1 className="text-center w-full py-10 text-xl font-bold text-yellow2">cargando</h1>}
            endMessage={
              <p className="text-center w-full py-10 text-xl text-yellow2">
                <b>ya terminaron</b>
              </p>
            }
            className={"flex flex-wrap px-[40px]"}
          >
            {auctions.all.map((nft, key) => {
              return (
                <div className="w-full p-4  " key={key}>
                  <a
                    href={"/auction/" + nft.id}
                  >
                    <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                      <div className="trending-token w-full rounded-20 hover:shadow-yellow1   hover:scale-105 ">
                        <div className=" bg-white rounded-20 h-[365px] md:h-[170px] flex">
                          <div className="p-6 pt-3 pb-3  w-1/3">
                            <img
                              className="object-contain object-center rounded-xlarge h-[9rem]  bg-center"
                              src={`https://nativonft.mypinata.cloud/ipfs/${nft.nft_media}`}
                              alt={nft.description}
                            />
                          </div>
                          <div className=" pb-3 p-6 pt-3 flex flex-col  w-2/3">
                            <div className="capitalize text-black text-sm  text-ellipsis overflow-hidden whitespace-nowrap  font-raleway font-bold text-center"></div>
                            <div className="flex justify-around pt-2 flex-col">
                            
                              <div className="text-black font-raleway font-normal w-full text-base text-left"><span className="font-bold"></span>{nft.description}</div>
                              <div className="flex w-full text-left">
                                <div className="text-black text-sm font-raleway font-normal  w-1/3"><span className="font-bold">NFT ID: </span>{nft.nft_id}</div>
                                <div className="text-black text-sm font-raleway font-normal  w-2/3"><span className="font-bold">Propietario: </span>{nft.nft_owner}</div>
                              </div>
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Termina en: </span>{dayjs.unix(nft.auction_deadline / 1000).format("DD/MMM/YYYY HH:mm:ss")}</div>
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Status </span>{nft.status}</div>
                              <div className="text-black  text-lg  font-raleway font-normal   text-left"><span className="font-bold text-sm">Precio base </span>{fromYoctoToNear(nft.auction_base_requested)} Ⓝ</div>
                              <div className="text-black text-sm font-raleway font-normal text-left  "><span className="font-bold">Contrato </span>{nft.nft_contract}</div>
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

            </div>
          </div>
          </div>
      </section>
  );
}

export default Auctions;
