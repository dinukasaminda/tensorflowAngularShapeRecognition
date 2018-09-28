"use strict";
const nodemailer = require("nodemailer");

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const bodyParser = require("body-parser");
const zipFolder = require("zip-folder");

const fs = require("fs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 5000;
const server = http.Server(app);
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const io = new socketIo(server);

var clients = [];
var users = [];

app.get("/download-dataset", (req, res) => {
  var filePath = "./public/archive.zip";

  fs.open(filePath, "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        fs.unlinkSync(filePath);
        console.error("myfile already exists");
        return;
      }
    }
    zipFolder("./data-set/", filePath, function(err) {
      if (err) {
        console.log("oh no!", err);
      } else {
        res.json({
          path: "/archive.zip"
        });
        console.log("EXCELLENT");
      }
    });
  });
});
app.post("/saveData", (req, res) => {
  console.log("save Data calld.");
  var x = req.body.x;
  var y = req.body.y;
  var imgUrlData = req.body.imgUrlData;
  var data = { x: x, y: y };
  var timeStamp = new Date().getTime();
  var dir = "./data-set/" + y + "/";
  var filename = timeStamp + ".json";
  var filenameImg = timeStamp + ".png";
  var jsonData = JSON.stringify(data);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.open(dir + filename, "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        console.error("myfile already exists");
        return;
      }

      throw err;
    }
    var base64Data = imgUrlData.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(dir + filenameImg, base64Data, "base64", cb => {
      console.log(filenameImg + " saved.");
    });
    fs.writeFile(dir + filename, jsonData, cb => {
      console.log(filename + " saved.");
    });
  });
  fs.readdir(dir, function(err, items) {
    console.log("Letter:" + y + " Count:" + parseInt(items.length / 2));
    res.json({ count: "Letter:" + y + " Count:" + parseInt(items.length / 2) });
  });
});
console.log();
app.get("/clients", (req, res) => {
  console.log("Client calld.");
  res.json({
    msg: " active Clients ",
    users: users,
    usersCount: users.length
  });
});
app.post("/app_sendMsg_QApp_sikuru7SecureConn", (req, res) => {
  console.log("notify called.");

  if (req.body.type != undefined && req.body.type == 1) {
    var to_id = req.body.to_id;
    var pushData = req.body.push_data;

    var userClient = null;
    for (var i = 0; i < clients.length; i++) {
      var tempClient = clients[i];
      if (tempClient.userId == to_id) {
        userClient = tempClient;
        break;
      }
    }
    if (userClient != null) {
      try {
        userClient.client.emit("PushMsgReceive", {
          type: req.body.type,
          pushData: pushData,
          myId: to_id
        });
        console.log(to_id);
      } catch (err) {
        console.log(err);
      }
    }
    res.json({ msg: "ok" });
  }
});

io.on("connection", socket => {
  var userClient = null;
  var user = null;
  console.log(socket.id);
  socket.emit("init", {
    msg_id: 1,
    content: "fdsfsf"
  });
  socket.on("initChatId", data => {
    userClient = {
      userId: data.userId,
      clientId: socket.id,
      client: socket
    };
    user = { clientId: socket.id, userId: data.userId };

    for (var i = 0; i < clients.length; i++) {
      var tempClient = clients[i];
      if (tempClient.userId == userClient.userId) {
        clients.splice(i, 1);
      }
    }

    for (var i = 0; i < users.length; i++) {
      var tempUser = users[i];
      if (tempUser.userId == user.userId) {
        users.splice(i, 1);
      }
    }

    console.log("user Init userId: " + user.userId);
    clients.push(userClient);
    users.push(user);
  });
  socket.on("disconnect", function() {
    if (userClient != null) {
      console.log("user Disconnected userId: " + user.userId);
      var idx = clients.indexOf(userClient);
      clients.splice(idx, 1);

      var idxu = users.indexOf(user);
      users.splice(idxu, 1);
    }
  });
});
app.post("/app_sendEail_560_gmailServer", (req, res) => {
  try {
    if (
      req.body.tokenID_aop == "MailusingApp_gdfgdfgdgg__GfgGGHHHHHHH_dink_isn8"
    ) {
      console.log(req.body.AppGhghMailData);
      var myEmail = req.body.AppGhghMailData.myEmail;
      var toEmail = req.body.AppGhghMailData.toEmail;
      var subject = req.body.AppGhghMailData.subject;
      var htmlBody = req.body.AppGhghMailData.htmlBody;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: myEmail,
          pass: "newpas345dMyapp"
        }
      });
      var mailOptions = {
        from: myEmail,
        to: toEmail,
        subject: subject,
        html: htmlBody
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          res.status(400).json({ msg: "err" });
        } else {
          res.json({ msg: "ok" });
          console.log("Email sent: " + info.response);
        }
      });
    } else {
      res.status(400).json({ msg: "err" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "err" });
  }
});

/*const path = require('path')


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/
