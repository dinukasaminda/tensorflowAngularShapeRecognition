import {
  Directive,
  HostListener,
  HostBinding,
  ElementRef,
  Output,
  EventEmitter,
  OnInit
} from "@angular/core";

@Directive({
  selector: "[drawable]"
})
export class DrawableDirective implements OnInit {
  pos = { x: 0, y: 0 };
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  @Output()
  genOut = new EventEmitter();
  @Output()
  MediaMobile = new EventEmitter();
  @Output()
  imgOut = new EventEmitter();

  canvasEventMouseMove = false;
  canvasEventMouseDown = false;
  canvasEventMouseIn = false;
  downPosGot = false;
  downPos: any = null;
  mousePos: any = null;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.canvas = this.el.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.canvas.width = 200;
    this.ctx.canvas.height = 200;
    this.clear();
  }
  @HostListener("touchstart", ["$event"])
  touchStart(event: TouchEvent) {
    this.canvasEventMouseDown = true;
    this.canvasEventMouseIn = true;

    this.MediaMobile.emit(true);
    event.preventDefault();
    event.stopPropagation();
  }
  @HostListener("touchend", ["$event"])
  touchEnd(event: TouchEvent) {
    this.canvasEventMouseDown = false;
    this.canvasEventMouseIn = false;
    this.downPosGot = false;
    // this.newImage.emit(this.getImgData());
    this.getImgData();
  }
  @HostListener("touchmove", ["$event"])
  touchMove(event: TouchEvent) {
    this.canvasEventMouseMove = true;
    event.preventDefault();
    event.stopPropagation();
    this.touchEvent(event);
  }
  touchEvent(event: TouchEvent) {
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    this.drawLetter({ clientX: x, clientY: y }, true);
  }
  MouseEvent(event: MouseEvent) {
    this.drawLetter({ offsetX: event.offsetX, offsetY: event.offsetY }, false);
  }
  @HostListener("mouseenter", ["$event"])
  onEnter(e) {}

  @HostListener("mousedown", ["$event"])
  onDown(e) {
    this.canvasEventMouseDown = true;
    this.canvasEventMouseIn = true;
    event.preventDefault();
    event.stopPropagation();
  }
  @HostListener("mouseup", ["$event"])
  onUp(e) {
    this.canvasEventMouseDown = false;
    this.canvasEventMouseIn = false;
    this.downPosGot = false;
    //this.newImage.emit(this.getImgData());
    this.getImgData();
  }
  @HostListener("mousemove", ["$event"])
  onMove(e) {
    if (e.buttons !== 1) {
      return;
    }
    this.canvasEventMouseMove = true;
    event.preventDefault();
    event.stopPropagation();
    this.MouseEvent(e);
  }
  drawLetter(event: any, Mobile: boolean) {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, 29, 29);
    if (this.canvasEventMouseDown && this.canvasEventMouseIn) {
      let MousePos = null;
      if (Mobile) {
        const rect = this.el.nativeElement.getBoundingClientRect();
        MousePos = [event.clientX - rect.left, event.clientY - rect.top];
      } else {
        // const rect = this.el.nativeElement.getBoundingClientRect();
        MousePos = [event.offsetX, event.offsetY];
      }
      if (!this.downPosGot) {
        this.downPos = MousePos;
        this.lastPos = MousePos;
        this.mousePos = MousePos;
        this.downPosGot = true;
        //this.clear();
      } else {
        this.mousePos = MousePos;
        this.drawOnCanvas();
        this.lastPos = MousePos;
      }
    } else {
      this.downPosGot = false;
    }
  }
  private drawOnCanvas() {
    if (!this.ctx) {
      return;
    }
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#0000ff";
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPos[0], this.lastPos[1]); // from
    this.ctx.lineTo(this.mousePos[0], this.mousePos[1]);
    this.ctx.stroke();
  }
  lastPos = [0, 0];
  @HostListener("resize", ["$event"])
  onResize(e) {
    this.ctx.canvas.width = 200;
    this.ctx.canvas.height = 200;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  getImgData(): ImageData {
    const scaled = this.ctx.drawImage(this.canvas, 0, 0, 28, 28);
    this.imgOut.emit(this.el.nativeElement.toDataURL());
    var inputMat = [];
    var i = 0;
    var j = 0;
    var width = 28;

    for (var j = 0; j < width; j++) {
      var currentRow = [];
      for (var i = 0; i < width; i++) {
        var pix = this.ctx.getImageData(i, j, 1, 1).data;
        var v = 0;
        if (pix[0] > 240 && pix[1] > 240 && pix[2] > 240) {
          v = 0;
        } else {
          v = pix[2];
          v = v / 255;
        }
        //console.log(v);

        currentRow.push(v);
      }
      inputMat.push(currentRow);
    }
    console.log(inputMat);
    this.genOut.emit(inputMat);
    return this.ctx.getImageData(0, 0, 28, 28);
  }
}
