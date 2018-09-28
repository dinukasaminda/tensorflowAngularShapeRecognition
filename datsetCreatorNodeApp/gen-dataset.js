const fs = require("fs");
const dir = "./data-set";
const lables = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

fs.readdir(dir, function(err, items) {
  console.log(items);
  items.forEach(item => {
    var data_points = fs.readdirSync(dir + "/" + item);
    data_points = data_points.filter(letterFile =>
      letterFile.endsWith(".json")
    );
    data_points.forEach(Fileitem => {
      var data = fs.readFileSync(dir + "/" + item + "/" + Fileitem);
      var dataMat = JSON.parse(data);
      var xMat = dataMat.x;
      var yValue = lables.indexOf(item);
      var dataFlatten = "" + yValue;
      xMat.forEach(row => {
        //dataFlatten = "";
        row.forEach(xv => {
          dataFlatten += "," + xv;
        });
        //console.log(dataFlatten);
      });
      console.log(
        "====item:" +
          item +
          "==" +
          yValue +
          "==" +
          lables[yValue] +
          "==============="
      );
      //console.log(dataFlatten);
      fs.appendFileSync(
        "letter-my-dataset-v3.csv",
        dataFlatten + "\n",
        function(err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    });
    console.log(item + " letters count:" + data_points.length);
  });
});
