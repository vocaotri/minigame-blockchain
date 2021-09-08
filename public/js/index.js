let currentAcc = "";
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_adr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_id",
        type: "string",
      },
    ],
    name: "broadcastUser",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
    ],
    name: "Register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "arrUser",
    outputs: [
      {
        internalType: "string",
        name: "_ID",
        type: "string",
      },
      {
        internalType: "address",
        name: "_VI",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const adrSM = "0xF1A2E599C35d6483Dd99b0cf04bA2EF4C879a109";
const web3 = new Web3(window.ethereum);
window.ethereum.enable();
let contractMM = new web3.eth.Contract(abi, adrSM);

$(document).ready(function () {
  $("#submit-form").click(async function () {
    if (currentAcc === "" || currentAcc.length < 1) {
      alert("Something wrong! You don't have account");
      window.location.reload(true);
      return false;
    }
    $.post(
      "/register",
      {
        name: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        currentAcc: currentAcc,
      },
      function (data) {
        if (data.user) {
          let { _id } = data.user || "";
          contractMM.methods
            .Register(_id)
            .send({
              from: currentAcc,
            })
            .catch((err) => {
              if (err.code === 4001) {
                alert("You are denied transaction signature.");
              }
            });
        }
      }
    );
  });
  if (checkMMs()) {
    $("#alert-conn").removeClass("hide-alert");
    connectMMs()
      .then((res) => {
        currentAcc = res;
        $("#id_adr").text(currentAcc);
        $("#alert-conn").addClass("hide-alert");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const socket = io();

  // watching and listen
  window.ethereum.on("accountsChanged", function (accounts) {
    // Time to reload your interface with accounts[0]!
    currentAcc = accounts[0];
    $("#id_adr").text(currentAcc);
  });
  socket.on("newUser", function (user) {
    $("#tb-list-user").append(`
      <tr>
          <td class="row">${user.name}</td>
          <td>${user.email}</td>   
          <td>${user.phone}</td>
          <td>${user.address_wallet}</td>
      </tr>
    `);
  });
  socket.on("userWin", function (user) {
    $("#tb-list-user-win").append(`
      <tr>
          <td class="row">${user.name}</td>
          <td>${user.email}</td>   
          <td>${user.phone}</td>
          <td>${user.address_wallet}</td>
          <td>${user.winner === "won50" ? "50%" : "100%"}</td>
      </tr>
    `);
  });
});
// function common
function checkMMs() {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
    return true;
  } else {
    const letIns = confirm(
      "Please install meta mask and come here late.\nClick ok go to store and install it."
    );
    let urlRedirect = "https://google.com";
    if (letIns) {
      urlRedirect =
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US";
    }
    window.location.href = urlRedirect;
    return false;
  }
}
async function connectMMs() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}
