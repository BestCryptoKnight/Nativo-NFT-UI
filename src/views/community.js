import React from "react";
import {
    getContract,
    syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import { useParams, useHistory } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import verifyImage from '../assets/img/Check.png';
import nativoLogo from '../assets/img/logo_nativo.png'
import discordLogo from '../assets/img/community/discord_logo1.svg'
import discord from '../assets/img/community/discord1.png'
import mediumLogo from '../assets/img/community/medium_logo.svg'
import medium from '../assets/img/community/medium1.png'
import twitterLogo from '../assets/img/community/twitter_logo1.svg'
import twitter from '../assets/img/community/twitter1.png'
import telegramLogo from '../assets/img/community/telegram_logo1.svg'
import telegram from '../assets/img/community/telegram1.png'
import githubLogo from '../assets/img/community/github_logo.svg'
import github from '../assets/img/community/github1.png'

function Community() {
        const [Landing, setLanding] = React.useState({
        theme: "yellow",
        currency: currencys[parseInt(localStorage.getItem("blockchain"))],
        tokens: [],
        page: parseInt(window.localStorage.getItem("page")),
        pag: window.localStorage.getItem("pagSale"),
        blockchain: localStorage.getItem("blockchain"),
        tokensPerPage: 9,
        tokensPerPageNear: 9,
    });

    return (
        <section className={"text-gray-600 body-font pt-20 dark:bg-darkgray"}>
            {/* <div className="mx-auto grid min-h-[50vh] grid-cols-1 gap-10 sm:max-w-[2000px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center"> */}
            <div className="mx-auto flex flex-row flex-wrap space-x-4 justify-center">

                {/* Discord */}
                <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                    <div className="flex items-center min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group">
                        <a className="w-full flex justify-center">
                            <img className="rounded-t-lg mx-auto mt-[40px] min-w-[245px] max-w-[245px] opacity-20 transition-opacity group-hover:opacity-100 rounded group-hover:bg-opacity-90 absolute z-[2]" src={discordLogo} alt="" />
                            <img className="min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] z-[1] group-hover:brightness-50" src={discord} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Twitter */}
                <a href="https://twitter.com/nativonft" target="_blank">
                    <div className="flex items-center min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group">
                        <a className="w-full flex justify-center">
                            <img className="rounded-t-lg mx-auto mt-[40px] min-w-[245px] max-w-[245px] opacity-20 transition-opacity group-hover:opacity-100 rounded group-hover:bg-opacity-90 absolute z-[2]" src={twitterLogo} alt="" />
                            <img className="min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] z-[1] group-hover:brightness-50" src={twitter} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/+TFdhJmJzwmkwNDQx" target="_blank">
                    <div className="flex items-center min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group">
                        <a className="w-full flex justify-center">
                            <img className="rounded-t-lg mx-auto mt-[40px] min-w-[245px] max-w-[245px] opacity-20 transition-opacity group-hover:opacity-100 rounded group-hover:bg-opacity-90 absolute z-[2]" src={telegramLogo} alt="" />
                            <img className="min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] z-[1] group-hover:brightness-50" src={telegram} alt="" />
                        </a>
                    </div>
                </a>

                {/* Medium */}
                <a href="https://nativonft.medium.com/" target="_blank">
                <div className="flex items-center min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group">
                <a className="w-full flex justify-center">
                        <img className="rounded-t-lg mx-auto mt-[40px] min-w-[245px] max-w-[245px] opacity-20 transition-opacity group-hover:opacity-100 rounded group-hover:bg-opacity-90 absolute z-[2]"src={mediumLogo} alt="" />
                            <img className="min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] z-[1] group-hover:brightness-50" src={medium} alt="" />
                        </a>
                    </div>
                </a> 

                {/* Github */}
               <a href="https://github.com/cloudmex/Nativo-NFT-UI" target="_blank">
               <div className="flex items-center min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group">
               <a className="w-full flex justify-center">
                        <img className="rounded-t-lg mx-auto mt-[40px] min-w-[245px] max-w-[245px] opacity-20 transition-opacity group-hover:opacity-100 rounded group-hover:bg-opacity-90 absolute z-[2]" src={githubLogo} alt="" />
                            <img className="min-h-[369px] max-h-[369px] min-w-[256.5px] max-w-[256.5px] z-[1] group-hover:brightness-50" src={github} alt="" />
                        </a>
                    </div>
                </a> 

            </div>
        </section>
    );
}

export default Community;
