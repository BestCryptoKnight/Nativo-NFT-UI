import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { isNearReady } from "../utils/near_interaction";
import GoNear from "../views/goNear";
import { useWalletSelector } from "../utils/walletSelector";

const NearProtectedRoute = ({ component: Component, ...rest }) => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [state, setState] = useState(false);
  useEffect(() => {
    (async () => {
      setState(accountId !=null ? true : false);
    })();
  }, []);
  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          return state ? <Component {...props} /> : <GoNear />;
        }}
      />
    </>
  );
};

export default NearProtectedRoute;
