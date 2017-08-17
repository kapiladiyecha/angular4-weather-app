import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import 'hammerjs';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {WeatherComponent} from './weather/weather.component';
import {MdIconRegistry} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import {CoreModule} from "./core/core.module";
import {RoutingModule} from "./app-routing.module";
import {MaterialComponentsModule} from "./material-components/material-components.module";

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    MaterialComponentsModule,
  ],
  providers: [MdIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule {
}
