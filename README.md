# NFT Marketplace de comunidades latinas

## 💻 Tecnologias usadas

Esta es la parte del proyecto enfacada en la UI/UX para esto se necesitaron las siguientes tecnologias:

1. Node.js >= 12 
2. React 
3. MetaMask (Extensión del navegador y móvil)
4. Infura (IPFS gateway)
5. Truffle framework

## 👨🏻‍💻 Instalación local del proyecto

Para correr este proyecto de forma local se necesitan los siguientes requerimientos:

1. Tener instalado [Node.js] en su versión 12 o superior (recomendamos utilizar la herramienta de [nvm])
2. Instalar el manejador de paquetes de yarn `npm install -g yarn`
3. Instalar las dependencias del proyecto `npm install` o `yarn install` dentro del directorio que contiene el archivo `package.json`
4. Instalar de forma global el framework de Truffle `npm install -g truffle`
5. Compilar tailwind de manera local `npm run build-dev-tailwind`

## 📚 Arbol de archivos
```bash
├── README.md                                    # Este archivo
├── package-lock.json
├── package.json                                 # Archivo que contiene los scripts y dependencias
├── public                                       # Directorio con los archivos publicos
│   ├── ads.txt
│   ├── favicon.png
│   ├── index.html
│   ├── manifest.json
│   ├── preview.gif
│   └── robots.txt
└── src                                          # Directorio fuente del proyecto en react
    ├── App.js                                   # Archivo con el punto de montaje del componente app
    ├── App.test.js
    ├── HOCS
    │   └── MetamaskProtectedRoute.hoc.js        # Archivo que controla las rutas protegidas con metamask
    ├── assets                                   # Directorio con los recursos del slider
    │   └── landingSlider
    │       ├── img
    │       │   ├── ArteHuichol_Uno.jpg
    │       │   ├── flauta.jpg
    │       │   └── flor.jfif
    │       └── sliderData.js
    ├── blocks                                  # Directorio con componentes para tailwind css
    ├── components                              # Directorio de los componenetes en react
    │   ├── Footer.component.js
    │   ├── Hero.component.js
    │   ├── Navbar.component.js
    │   ├── imageSlider.component.js
    │   ├── modal.component.js
    │   ├── modalRevender.component.js
    │   ├── nftatribute.component.js
    │   ├── statistc.component.js
    │   ├── steps.component.js
    │   └── teamMembers.component.js
    ├── contracts                               # Directorio con los contratos para ser importados
    │   ├── Address.json
    │   ├── Context.json
    │   ├── Counters.json
    │   ├── ERC165.json
    │   ├── ERC721.json
    │   ├── ERC721Enumerable.json
    │   ├── IERC165.json
    │   ├── IERC721.json
    │   ├── IERC721Enumerable.json
    │   ├── IERC721Metadata.json
    │   ├── IERC721Receiver.json
    │   ├── MarketPlace.json
    │   ├── Migrations.json
    │   └── Strings.json
    ├── icons
    ├── index.cs                                # Archivo index de css del proyecto
    ├── index.js                                # Archivo index del proyecto
    ├── serviceWorker.js                        # Archivo de configuración del service worker
    ├── setupTests.js
    ├── utils                                   # Directorio con archivos de utlidad
    │   ├── blockchain_interaction.js           # Archivo que controla la interacción con metamask
    │   └── constraint.js                       # Archivo para el control de formato de archivos
    └── views                                   # Directorio con las vistas de la Dapp
        ├── Detail.view.js
        ├── Galeria.view.js
        ├── Landing.view.js
        ├── MisTokens.view.js
        ├── goMetamask.js
        ├── mintNft.view.js
        └── notFound.view.js
```
 
[Node.js]: https://nodejs.org/en/download/package-manager/
[nvm]: https://github.com/nvm-sh/nvm
