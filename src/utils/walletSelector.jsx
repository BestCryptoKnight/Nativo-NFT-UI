import React, { useCallback, useContext, useEffect, useState } from "react";
import { map, distinctUntilChanged } from "rxjs";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { providers, utils } from "near-api-js";

const WalletSelectorContext = React.createContext(null);

export const WalletSelectorContextProvider = ({ children }) => {
    const [selector, setSelector] = useState(null);
    const [modal, setModal] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: process.env.REACT_APP_NEAR_ENV,
            debug: true,
            modules: [
                setupNearWallet(),
                setupMyNearWallet(),
                // setupSender(),
                // setupMathWallet(),
                // setupNightly(),
                // setupMeteorWallet(),
            ],
        });
        const _modal = setupModal(_selector, { contractId: process.env.REACT_APP_CONTRACT });
        const state = _selector.store.getState();
        setAccounts(state.accounts);
        window.selector = _selector;
        window.modal = _modal;
        setSelector(_selector);
        setModal(_modal);
    }, []);
    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert("Failed to initialise wallet selector");
        });
    }, [init]);
    useEffect(() => {
        if (!selector) {
            return;
        }
        const subscription = selector.store.observable
            .pipe(map((state) => state.accounts), distinctUntilChanged())
            .subscribe((nextAccounts) => {
            console.log("Accounts Update", nextAccounts);
            setAccounts(nextAccounts);
        });
        return () => subscription.unsubscribe();
    }, [selector]);
    if (!selector || !modal) {
        return null;
    }
    const accountId = accounts.find((account) => account.active)?.accountId || null;
    return (<WalletSelectorContext.Provider value={{
            selector,
            modal,
            accounts,
            accountId,
        }}>
      {children}
    </WalletSelectorContext.Provider>);
};
export function useWalletSelector() {
    const context = useContext(WalletSelectorContext);
    if (!context) {
        throw new Error("useWalletSelector must be used within a WalletSelectorContextProvider");
    }
    return context;
}