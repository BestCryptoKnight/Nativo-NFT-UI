import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import './index.css';
import './tailwind.output.css';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_es from "./translations/es/global.json"
import global_en from "./translations/en/global.json"
import {WalletSelectorContextProvider} from "./utils/walletSelector"
import "@near-wallet-selector/modal-ui/styles.css";
import { HelmetProvider } from 'react-helmet-async';
i18next.init({
    interpolation: { escapeValue: false },
    lng: (window.localStorage.getItem("LanguageState") == "en" ? "en" : "es"),
    resources: {
        es: {
            global: global_es
        },
        en: {
            global: global_en
        }
    }
})

ReactDOM.render(
    <I18nextProvider i18n={i18next}>      
        <WalletSelectorContextProvider>
            <App />
        </WalletSelectorContextProvider>  
    </I18nextProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
