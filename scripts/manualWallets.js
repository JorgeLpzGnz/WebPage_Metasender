import { login, isConnected } from "./connectWallet.js";
import setResumeInfo from "./resume.js";
import { finalData, processFinalData } from "./finalData.js";
const manualWalletsContainer = document.querySelector(
  ".manual-wallets-container"
);
const addWalletButton = document.querySelector(".add-wallet-button");
const walletInput = document.querySelector(".wallet-input");
const amountInput = document.querySelector(".amount-input");
const optionManual = document.querySelector(".option-manual");
const optionFile = document.querySelector(".option-file");
const manualDataContainer = document.querySelector(".manual-data-container");
const fileDataContainer = document.querySelector(".file-data-container");
const continueBtnManual = document.querySelector(".continue-btn-manual");
const sendProcessSection = document.getElementById("send-process");
const tokenInput = document.getElementById("token-input");
const labelAdress = document.querySelector(".label-adress");
const labelAmount = document.querySelector(".label-amount");
const spanWallet = document.querySelector(".span-wallet");
const spanAmount = document.querySelector(".span-amount");
const resumenFinalContainer = document.querySelector(
  ".resumen-final-container"
);
const blockExplorerLinkItem = document.querySelector(".blockExplorerLink");
const atrasbtn = document.querySelector(".atras-btn");
//resumen operacion
const totalWallets = document.querySelector(".total-wallets");
const totalTokens = document.querySelector(".total-tokens");
const balanceTokens = document.querySelector(".balance-tokens");
const balanceEth = document.querySelector(".balance-eth");
const costoOperacion = document.querySelector(".costo-operacion");

let walletsManualArr = [];
let amountManualArr = [];
let tokenToSendManual = tokenInput.value;

let numberOfCorrectNewWallet = 0;
let numberOfIncorrectNewWallet = 0;
let newWalletsFragment = document.createDocumentFragment();

let newIncorrectsWalletsFragment = document.createDocumentFragment();
const incorrectWalletsContainer = document.querySelector(
  ".incorrect-wallets-container"
);

optionManual.addEventListener("click", () => {
  if (isConnected) {
    manualDataContainer.style.display = "flex";
    fileDataContainer.style.display = "none";
    resumenFinalContainer.style.display = "none";
  } else login();
});

function changeTypeOfToken() {
  switch (tokenInput.value) {
    case "ETH" || "BNB" || "MATIC" || "AVAX" || "FTM" || "ETC":
      labelAdress.innerHTML = "Cuenta o Wallet a enviar";
      walletInput.placeholder = "Escribe la wallet";
      labelAmount.innerHTML = "Monto a Enviar";
      amountInput.placeholder = "Escribe el monto";
      amountInput.pattern = `^\\d*\\.\\d+$|^\\d*\\d+$`;
      break;
    case "ERC20":
      labelAdress.innerHTML = "Adress del contrato del token";
      walletInput.placeholder = "Escribe el Adress del contrato";
      labelAmount.innerHTML = "Cantidad de tokens a enviar";
      amountInput.placeholder = "Escribe cantidad de tokens";
      amountInput.pattern = `^\\d*\\.\\d+$|^\\d*\\d+$`;
      break;
    case "ERC721":
      labelAdress.innerHTML = "Adress del contrato del token";
      walletInput.placeholder = "Escribe el Adress del contrato";
      labelAmount.innerHTML = "ID del token a enviar";
      amountInput.placeholder = "Escribe el ID del token";
      amountInput.pattern = `^\\d*\\d+$`;
      amountInput.innerHTML = `Solo numeros enteros positivos`;
      break;
  }
}

function addWallet() {
  if (walletInput.value && amountInput.value !== "") {
    verifyManualData(walletInput.value, amountInput.value, tokenInput.value);

    showWallets(true, false);
    continueBtnManual.classList.add("opacity");
  } else {
    if (walletInput.value == "") {
      spanWallet.innerHTML = "Completa este campo";
      spanWallet.classList.add("is-active");
      setTimeout(() => {
        spanWallet.classList.remove("is-active");
        spanWallet.innerHTML = walletInput.title;
      }, 3000);
    }

    if (amountInput.value == "") {
      spanAmount.innerHTML = "Completa este campo";
      spanAmount.classList.add("is-active");
      setTimeout(() => {
        spanAmount.classList.remove("is-active");
        spanAmount.innerHTML = amountInput.title;
      }, 3000);
    }
  }
}

function verifyManualData(wallet, amount, typeOfToken) {
  let walletRegex = new RegExp(walletInput.pattern);
  let AmountRegex = new RegExp(amountInput.pattern);

  !walletRegex.exec(wallet)
    ? spanWallet.classList.add("is-active")
    : spanWallet.classList.remove("is-active");

  !AmountRegex.exec(amount)
    ? spanAmount.classList.add("is-active")
    : spanAmount.classList.remove("is-active");

  if (walletRegex.exec(wallet) && AmountRegex.exec(amount)) {
    addOkWalletElement(wallet, amount, typeOfToken);
    walletInput.value = "";
    amountInput.value = "";
  }
}

function verifyFileData(wallet, amount, typeOfToken) {
  let walletRegex = new RegExp(walletInput.pattern);
  let AmountRegex = new RegExp(amountInput.pattern);
  let walletError = "wallet error";
  let amountError = "amount error";
  let allError = "all errors";

  //if is ok data
  if (walletRegex.exec(wallet) && AmountRegex.exec(amount)) {
    addOkWalletElement(wallet, amount, typeOfToken);
  }

  //if is error data
  if (!walletRegex.exec(wallet) || !AmountRegex.exec(amount)) {
    if (!walletRegex.exec(wallet) && !AmountRegex.exec(amount)) {
      addIncorrectWalletElement(wallet, amount, typeOfToken, allError);

      showWallets(false, true);
    } else {
      if (!walletRegex.exec(wallet)) {
        addIncorrectWalletElement(wallet, amount, typeOfToken, walletError);

        showWallets(false, true);
      }

      if (!AmountRegex.exec(amount)) {
        addIncorrectWalletElement(wallet, amount, typeOfToken, amountError);

        showWallets(false, true);
      }
    }

    addIncorrectWalletElement(wallet, amount, typeOfToken);

    showWallets(false, true);
  }
}

function deleteOkWallet(event) {
  manualWalletsContainer.removeChild(event.target.parentNode.parentNode);
}

function editOkWallet(event) {
  let parentElement = event.target.parentNode.parentNode;
  //console.log(parentElement.childNodes);
  parentElement.childNodes.forEach((element) => {
    if (element.classList == "wallet-adress") {
      walletInput.value = element.innerHTML;
    }
    if (element.classList == "wallet-amount") {
      amountInput.value = element.innerHTML;
    }
  });
  walletInput.classList.add("edit");
  amountInput.classList.add("edit");
  setTimeout(() => {
    walletInput.classList.remove("edit");
    amountInput.classList.remove("edit");
  }, 1000);
  manualWalletsContainer.removeChild(parentElement);
  renameNumberOfWallets();
}

//rename wallets when someone is delete
function renameNumberOfWallets() {
  let numberOfWallet = document.querySelectorAll(".number-of-wallet");

  for (let i = 0; i < numberOfWallet.length; i++) {
    numberOfWallet[i].parentNode.id = i + 1;
    numberOfWallet[i].innerHTML = i + 1;
    numberOfCorrectNewWallet = i + 1;
  }
}

function deleteIncorrectWallet(event) {
  incorrectWalletsContainer.removeChild(
    event.target.parentNode.parentNode.parentNode
  );
}

function editIncorrectWallet(event) {
  let parentElement = event.target.parentNode.parentNode.parentNode;
  let parentElement2 = event.target.parentNode.parentNode;
  console.log(parentElement.childNodes);
  parentElement2.childNodes.forEach((element) => {
    if (element.classList == "wallet-adress") {
      walletInput.value = element.innerHTML;
    }
    if (element.classList == "wallet-amount") {
      amountInput.value = element.innerHTML;
    }
  });
  walletInput.classList.add("edit");
  amountInput.classList.add("edit");
  setTimeout(() => {
    walletInput.classList.remove("edit");
    amountInput.classList.remove("edit");
  }, 1000);
  incorrectWalletsContainer.removeChild(parentElement);
  //renameNumberOfWallets();
}

//add new ok wallet element
function addOkWalletElement(wallet, amount, typeOfToken) {
  numberOfCorrectNewWallet += 1;
  let newWalletContainer = document.createElement("div");
  newWalletContainer.id = numberOfCorrectNewWallet;
  newWalletContainer.classList.add("manual-wallet");
  newWalletContainer.innerHTML = `
    <p class="number-of-wallet">${numberOfCorrectNewWallet}</p>
    <p class="wallet-adress">${wallet}</p>
    <p class="wallet-amount">${amount}</p>
    <p>${typeOfToken}</p>
    <a>
      <img class="edit-wallet" src="../img/icons/boton-editar.png"
        alt="cerrar pagina" />
    </a>
    <a>
      <img class="delete-wallet" src="../img/icons/cerrar.png"
        alt="cerrar pagina" />
    </a>`;
  newWalletsFragment.appendChild(newWalletContainer);
}

//add new error wallet element
function addIncorrectWalletElement(wallet, amount, typeOfToken, whatError) {
  numberOfIncorrectNewWallet += 1;
  console.log(numberOfIncorrectNewWallet);
  let newWalletErrorsContainer = document.createElement("div");
  newWalletErrorsContainer.id = numberOfIncorrectNewWallet;
  newWalletErrorsContainer.classList.add("wallet-errors-container");
  let walleterrorElement = `
  <div id="${numberOfIncorrectNewWallet}" class="manual-wallet">
    <p class="number-of-wallet">${numberOfIncorrectNewWallet}</p>
    <p class="wallet-adress">${wallet}</p>
    <p class="wallet-amount">${amount}</p>
    <p>${typeOfToken}</p>
    <a>
      <img class="edit-wallet" src="../img/icons/boton-editar.png" alt="cerrar pagina" />
    </a>
    <a>
      <img class="delete-wallet" src="../img/icons/cerrar.png" alt="cerrar pagina" />
    </a>
  </div>`;
  let onlyWalletError = `
  <div class="wallet-errors">
    <p><span>Wallet o Adress no valido: </span> "0x" + 40 caracteres alfanumericos sin espacios</p>
  </div>`;
  let onlyAmountError = `
  <div class="wallet-errors">
    <p><span>Monto no valido:</span> Solo numeros positivos</p>
  </div>`;
  let allErrors = `
  <div class="wallet-errors">
    <p><span>Wallet o Adress no valido: </span> "0x" + 40 caracteres alfanumericos sin espacios</p>
    <p><span>Monto no valido:</span> Solo numeros positivos</p>
  </div>`;

  switch (whatError) {
    case "wallet error":
      newWalletErrorsContainer.innerHTML = walleterrorElement + onlyWalletError;
      break;
    case "amount error":
      newWalletErrorsContainer.innerHTML = walleterrorElement + onlyAmountError;
      break;
    case "all errors":
      newWalletErrorsContainer.innerHTML = walleterrorElement + allErrors;
      break;
  }

  newIncorrectsWalletsFragment.appendChild(newWalletErrorsContainer);
}

function showWallets(showInOkWallets, showInErrorWallets) {
  manualWalletsContainer.appendChild(newWalletsFragment);

  incorrectWalletsContainer.appendChild(newIncorrectsWalletsFragment);
}

async function setFinalResume() {
  await setResumeInfo();

  totalWallets.innerHTML = finalData.numAddresses;

  totalTokens.innerHTML = finalData.totalToSend;

  balanceTokens.innerHTML = finalData.userTokenBalance;

  balanceEth.innerHTML = finalData.userETHBalance;

  costoOperacion.innerHTML = finalData.txCost;

  return;
}

//select type of token
tokenInput.addEventListener("click", () => {
  changeTypeOfToken();
});

//verify data and add new wallet
addWalletButton.addEventListener("click", () => {
  addWallet();
});

//delete ok wallet and edit ok wallet
manualWalletsContainer.addEventListener("click", (e) => {
  if (e.target.classList[0] == "delete-wallet") {
    deleteOkWallet(e);
    renameNumberOfWallets();
  }

  if (e.target.classList[0] == "edit-wallet") {
    editOkWallet(e);
  }
});

//delete incorrect wallet and edit incorrect wallet
incorrectWalletsContainer.addEventListener("click", (e) => {
  if (e.target.classList[0] == "delete-wallet") {
    deleteIncorrectWallet(e);

    //renameNumberOfWallets();
  }
  if (e.target.classList[0] == "edit-wallet") {
    editIncorrectWallet(e);
  }
});

continueBtnManual.addEventListener("click", async () => {
  walletsManualArr = [];
  amountManualArr = [];
  let walletAdress = document.querySelectorAll(".wallet-adress");
  let walletMount = document.querySelectorAll(".wallet-amount");

  walletAdress.forEach((walletAddres) => {
    walletsManualArr.push(walletAddres.innerHTML);
  });

  walletMount.forEach((walletMount) => {
    amountManualArr.push(walletMount.innerHTML);
  });

  processFinalData();

  console.log(finalData);

  await setFinalResume();

  manualDataContainer.style.display = "none";
  resumenFinalContainer.style.display = "block";
  blockExplorerLinkItem.style.opacity = 0;
});

atrasbtn.addEventListener("click", () => {
  manualDataContainer.style.display = "flex";
  resumenFinalContainer.style.display = "none";
});

export {
  walletsManualArr,
  amountManualArr,
  tokenToSendManual,
  verifyFileData,
  showWallets,
};
