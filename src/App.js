import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import getIcons from "./icons";

//components
import Navbar from "./components/Navbar.component";
import Footer from "./components/Footer.component";
import ColorBar from "./components/ColorBar.component";
//views
import Landing from "./views/Landing.view";
import Gallery from "./views/gallery";
import Detail from "./views/Detail.view";
import Mint from "./views/mintNft.view";
import MisNfts from "./views/MisTokens.view";
import creCol from "./views/createColl"
import Collections from "./views/collectionGallery"
import Community from "./views/community"
import TokensCollection from "./views/tokensCollection"
import SalesGallery from "./views/salesGallery"
import ProfileData from "./views/profileData"
import Profile from "./views/profile"
import notFound from "./views/notFound.view";
import { Helmet } from 'react-helmet';

//este hoc nos regresa el componente que le mandamos si tiene instalado metamask
//import MetamaskProtectedRoute from "./HOCS/MetamaskProtectedRoute.hoc";
import BlockchainProtectedRoute from "./HOCS/BlockchainProtectedRoute.hoc";
const { create } = require("ipfs-http-client");

//instancia de ipfs
window.ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
const iconList = getIcons();
const blockListArr = [];

Object.entries(iconList).forEach(([type, icons]) => {
  Object.keys(icons).map((name) => blockListArr.push(`${name},${type}`));
});

/* const themeList = [
  "indigo",
  "yellow",
  "red",
  "purple",
  "pink",
  "blue",
  "green",
]; */
//test
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
      theme: "yellow",
    };
  }
    
  render() {
    return (
      <>
        <Router>
          <Navbar theme={this.state.theme} />
          <Helmet>
            <meta property="og:title" content="Nativo NFT" />
            <meta property="og:description" content="Marketplace de NFT creado por y para la comunidad latina e hispano hablante creado sobre NEAR Protocol." />
            <meta property="og:image" content="https://www.talent-network.org/comunidades/wp-content/uploads/2022/09/tn-comunidades-22-nativo.png" />
            <meta property="og:url" content="https://deletejsfiles-metatags.dphj3ja30lftx.amplifyapp.com/" />
            <meta property="og:type" content="website" />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="Marketplace de NFT creado por y para la comunidad latina e hispano hablante creado sobre NEAR Protocol" />
            <title>Nativo NFT</title>
          </Helmet>
          <Switch>
            <Route exact path="/" component={Landing} />
            <BlockchainProtectedRoute path="/create" component={Mint} />
            <BlockchainProtectedRoute path="/profileData/:state" component={ProfileData} />
            <BlockchainProtectedRoute path="/collectionData/:state" component={creCol} />
            <Route path="/profile/:user" component={Profile} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/market" component={SalesGallery} />
            <Route path="/collections" component={Collections} />
            <Route path="/community" component={Community} />
            <Route path="/collection/:data" component={TokensCollection} />
            <Route path="/detail/:data" component={Detail}/>
            <BlockchainProtectedRoute path="/mynfts" component={MisNfts} />
            <Route component={notFound} />
          </Switch>
          <Footer theme={this.state.theme} />
        </Router>
      </>
    );
  }
}

export default App;
