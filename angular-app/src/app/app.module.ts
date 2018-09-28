import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ChartsModule } from "ng2-charts/ng2-charts";

import { DrawableDirective } from "./drawable.directive";
import { ChartComponent } from "./chart/chart.component";
import { HttpModule } from "../../node_modules/@angular/http";
import { DataService } from "./services/data.service";

@NgModule({
  declarations: [AppComponent, ChartComponent, DrawableDirective],
  imports: [HttpModule, BrowserModule, AppRoutingModule, ChartsModule],
  providers: [HttpModule, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
