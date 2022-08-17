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
import discordLogo from '../assets/img/discord_logo.svg'
import discord from '../assets/img/discord.png'

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
        <section className={"text-gray-600 body-font py-64 dark:bg-darkgray"}>
            <div className="flex flex-row  mb-10 md:mb-0  justify-center " >
                <div className="max-w-sm m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105">
                    <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                        <img className="rounded-t-lg mx-auto pt-8 pb-8" src={discordLogo} alt="" />
                    </a>
                    <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                        <img className="rounded-t-lg mx-auto" src={discord} alt="" />
                    </a>
                </div>
                <div className="max-w-sm m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105">
                    <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                        <img className="rounded-t-lg mx-auto pt-8 pb-8" src={discordLogo} alt="" />
                    </a>
                    <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                        <img className="rounded-t-lg mx-auto" src={discord} alt="" />
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Community;
