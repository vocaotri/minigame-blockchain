const User = require("../models/user");
const Web3 = require("web3");
module.exports = function (app, abi, io) {
  const web3Infura = new Web3(process.env.ADRSM);
  let contractInfu = new web3Infura.eth.Contract(abi, process.env.ADRSM);
  // Listen event new user resgister
  contractInfu.events.broadcastUser(
    { filter: {}, fromBlock: "latest" },
    async function (err, res) {
      if (err) {
        console.log(err);
      } else {
        let user = await User.findById(res.returnValues._id);
        user.status = true;
        user.address_wallet = res.returnValues._adr;
        await user.save();
        io.sockets.emit("newUser", user);
      }
    }
  );
  // Listen event user win 50 %
  contractInfu.events.broadcastusersWinner50(
    { filter: {}, fromBlock: "latest" },
    async function (err, res) {
      if (err) {
        console.log(err);
      } else {
        let user = await User.findById(res.returnValues._id);
        user.winner = "won50";
        await user.save();
        io.sockets.emit("userWin", user);
      }
    }
  );

  // Listen event user win 100 %
  contractInfu.events.broadcastusersWinner100(
    { filter: {}, fromBlock: "latest" },
    async function (err, res) {
      if (err) {
        console.log(err);
      } else {
        let user = await User.findById(res.returnValues._id);
        user.winner = "won100";
        await user.save();
        io.sockets.emit("userWin", user);
      }
    }
  );

  app.get("/", async (req, res) => {
    let users = await User.find({ status: true });
    let userWinners = await User.find({
      status: true,
      winner: {
        $nin: ["waiting"],
      },
    });
    res.render("index", { users: users || [], userWinners: userWinners || [] });
  });
  // app.get('/test-socket' , (req , res)=>{
  //   io.sockets.emit("newUser", {data:"user"});
  // })
  app.post("/register", async (req, res) => {
    let dataPost = req.body;
    let user = {};
    if (Object.keys(dataPost).length > 2) {
      user = new User(dataPost);
      await user.save();
    }
    return res.json({ user: user });
  });
};
