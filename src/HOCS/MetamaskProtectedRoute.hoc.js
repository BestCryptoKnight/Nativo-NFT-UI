import React from "react";
import { Route } from "react-router-dom";

import { isMetamaskInstalled } from "../utils/blockchain_interaction";
import GoMetamask from "../views/goMetamask";
import { init } from "../utils/blockchain_interaction";

const MetamaskProtectedRoute = ({ component: Component, ...rest }) => {
  init();
  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          return isMetamaskInstalled() ? (
            <Component {...props} />
          ) : (
            <GoMetamask />
          );
        }}
      />
    </>
  );
};

export default MetamaskProtectedRoute;
