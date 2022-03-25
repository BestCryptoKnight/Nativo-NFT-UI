import React, { useState } from "react";
import { Route } from "react-router-dom";

import { isMetamaskInstalled } from "../utils/blockchain_interaction";
import BlockchainModal from "../components/modalBlockchain.component";
import { init } from "../utils/blockchain_interaction";
import blockchainModal from "../components/modalBlockchain.component";

import MetamaskProtectedRoute from "./MetamaskProtectedRoute.hoc";
import NearProtectedRoute from "./NearProtectedRoute.hoc";

// comprueba que hay una red seleccionada y manda una ruta
const BlockchainProtectedRoute = ({ component: Component, ...rest }) => {
  const [state, setState] = useState({
    show: true,
    title: "Selecciona una wallet",
  });

  return (
    <>
      <Route
        {...rest}
        render={(props) => {
          return localStorage.getItem("blockchain") ? (
            localStorage.getItem("blockchain") == "0" ? (
              <MetamaskProtectedRoute component={Component} {...props} />
            ) : (
              <NearProtectedRoute component={Component} {...props} />
            )
          ) : (
            <BlockchainModal {...{ ...state, change: setState }} />
          );
        }}
      />
    </>
  );
};

export default BlockchainProtectedRoute;
