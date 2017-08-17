import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WeatherComponent} from "./weather/weather.component";

const routes: Routes = [
  {
    path: '',
    component: WeatherComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule {
}
