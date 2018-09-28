import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { DrawableDirective } from "./drawable.directive";

import * as tf from "@tensorflow/tfjs";
import { DataService } from "./services/data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  linearModel: tf.Sequential;
  prediction: any;

  model: tf.Model;
  predictions: any;

  @ViewChild(DrawableDirective)
  canvas;

  @ViewChild("canvas2")
  public canvas2: ElementRef;
  private cx: CanvasRenderingContext2D;
  canvasEl: HTMLCanvasElement = null;
  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.trainNewModel();
    this.loadModel();

    this.canvasEl = this.canvas2.nativeElement;
    this.cx = this.canvasEl.getContext("2d");
    this.cx.canvas.width = 290;
    this.cx.canvas.height = 290;
    console.log("v::::::::::::" + this.lables[20]);
  }
  dataInput: any = null;
  async trainNewModel() {
    // Define a model for linear regression.
    this.linearModel = tf.sequential();
    this.linearModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Prepare the model for training: Specify the loss and the optimizer.
    this.linearModel.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // Training data, completely random stuff
    const xs = tf.tensor1d([
      3.2,
      4.4,
      5.5,
      6.71,
      6.98,
      7.168,
      9.779,
      6.182,
      7.59,
      2.16,
      7.042,
      10.71,
      5.313,
      7.97,
      5.654,
      9.7,
      3.11
    ]);
    const ys = tf.tensor1d([
      1.6,
      2.7,
      2.9,
      3.19,
      1.684,
      2.53,
      3.366,
      2.596,
      2.53,
      1.22,
      2.87,
      3.45,
      1.65,
      2.904,
      2.42,
      2.4,
      1.31
    ]);

    // Train
    await this.linearModel.fit(xs, ys);

    console.log("model trained!");
  }

  linearPrediction(val) {
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0];
  }

  //// LOAD PRETRAINED KERAS MODEL ////

  async loadModel() {
    this.model = await tf.loadModel("/assets/shape-recog-v1/model.json");
  }

  async predict(imageData: ImageData) {
    const pred = await tf.tidy(() => {
      /*// Convert the canvas pixels to
      let img = tf.fromPixels(imageData, 1);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, "float32");

      // Make and format the predications
      const output = this.model.predict(img) as any;

      // Save predictions on the component
      this.predictions = Array.from(output.dataSync());
      console.log(this.predictions);*/
    });
  }

  OtherDevice(val: boolean) {
    this.isOtherDevice = val;
  }
  genOut(v: Array<any>) {
    //console.log(v);
    this.cx.fillStyle = "#ffffff";
    this.cx.clearRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);

    this.cx.fillStyle = "#000000";
    this.cx.fillRect((10 + 1) * i, (10 + 1) * j, 10, 10);
    for (var j = 0; j < v.length; j++) {
      var row = v[j];
      for (var i = 0; i < row.length; i++) {
        var bDens = row[i] * 255;
        this.cx.fillStyle = "rgb(0,0," + bDens + ")";
        this.cx.fillRect((10 + 1) * i, (10 + 1) * j, 10, 10);
      }
    }
    this.dataInput = v;

    //let xv = tf.tensor(this.transformMatrics(v));
    let xv = tf.tensor(v);
    xv = xv.reshape([1, 28, 28, 1]);
    let output = this.model.predict(xv) as any;

    // Save predictions on the component
    this.predictions = Array.from(output.dataSync());
    var val = 0;
    var c = 0;
    var maxv = this.predictions[0];
    this.predictions.forEach(element => {
      if (element > maxv) {
        maxv = element;
        val = c;
      }
      c++;
    });

    var maxv2 = 0;
    var val2 = 0;
    c = 0;
    this.predictions.forEach(element => {
      if (element > maxv2 && element < maxv) {
        maxv2 = element;
        val2 = c;
      }
      c++;
    });
    this.predictedV = "" + this.lables[val] + ", i:" + val + ", Prob:" + maxv;
    this.predictedV2 =
      "" + this.lables[val2] + ", i:" + val2 + ", Prob:" + maxv2;
    console.log(this.predictions);
  }
  transformMatrics(inputV: Array<any>): Array<any> {
    var cols = Array(28);
    for (var i = 0; i < 28; i++) {
      cols[i] = [];
    }
    inputV.forEach(row => {
      for (var i = 0; i < 28; i++) {
        cols[i].push(row[i]);
      }
    });
    return cols;
  }
  isOtherDevice = false;
  imgUrlData: any = "";
  msg: string = "";
  imgOut(ImgStr: string) {
    console.log(ImgStr);
    this.imgUrlData = ImgStr;
  }
  SaveItem(item: string) {
    this.msg = "";
    var data = { x: this.dataInput, y: item, imgUrlData: this.imgUrlData };
    console.log(data);
    var origin = this.isOtherDevice
      ? "http://192.168.1.103:5000/"
      : "http://localhost:5000/";

    //origin = "./";
    this.dataService.openPost(origin + "saveData", data).subscribe(
      res => {
        let body = JSON.parse((<any>res)._body);
        console.log("ok" + body.count);
        this.msg = "ok" + body.count;
        this.canvas.clear();
      },
      err => {
        console.log("err");
        this.msg = "err";
      }
    );
  }
  predictedV = "";
  predictedV2 = "";
  lables = [
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
}
