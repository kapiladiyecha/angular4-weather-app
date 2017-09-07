/**
 * author: Kapil Adiyecha
 */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CacheService} from "ng2-cache-service";
import {WeatherService} from "./weather.service";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, AfterViewInit {

  google: any;
  locations: any;
  locationDetails: any;
  weatherDetails: any;
  locationForm: FormGroup;
  currentLocation: any;
  tempFactor = "&deg; C";
  isForecast = true;
  location = new FormControl('', Validators.required);
  isLoading = true;

  constructor(private _cacheService: CacheService,
              public weatherService: WeatherService) {
  }

  ngOnInit() {
    this.google = window["google"];
    this.createFormControl();
    this.setCurrentLocation();
    this.initAutoComplete();
  }

  createFormControl() {
    this.locationForm = new FormGroup({
      "location": this.location
    });
  }

  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
        this.weatherService.getWoeByLatLong(position.coords.latitude + "," + position.coords.longitude).subscribe(result => {
          if (result && result.length > 0) {
            this.weatherService.getWeatherByWoeId(result[0]['woeid']).subscribe(result => {
              this.weatherDetails = result;
              setTimeout(this.initAutoComplete, 200);
              this.isLoading = false;
              console.log('this.weatherDetails', this.weatherDetails);
            });
          }

        });
      });
    } else {
      console.log('Location not supported by vendor!');
    }
  }

  initAutoComplete() {
    var element = document.getElementById('txtPlaces');
    if (typeof(element) == 'undefined' || element == null)
      return;
    // this.google.maps.event.addDomListener(window, 'load', function () {
    var places = new this.google.maps.places.Autocomplete(element);
    var data = {places: places, weatherComponent: this};
    this.google.maps.event.addListener(places, 'place_changed', () => {
      var place = places.getPlace();
      var address = place.formatted_address;
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var mesg = "Address: " + address;
      mesg += "\nLatitude: " + latitude;
      mesg += "\nLongitude: " + longitude;
      console.log(mesg);

      this.weatherService.getWoeByLatLong(latitude + "," + longitude).subscribe(result => {
        if (result && result.length > 0) {
          this.weatherService.getWeatherByWoeId(result[0]['woeid']).subscribe(result => {
            this.weatherDetails = result;
            this.isLoading = false;
          });
        }
      });
    });
    // });
  }


  /**
   *
   * @param position
   */
  showPosition(position) {
    let latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
    let geocoder = new this.google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results);
          this.currentLocation = results[0];
          this.locationForm.patchValue({location: results[0].formatted_address});
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  onLocationChange() {
    console.log()
  }

  ngAfterViewInit() {

  }

  togglePrediction() {
    this.isForecast = !this.isForecast;
  }

  saveLocation() {
    this.weatherService.addLocation(this.location);
  }

  removeLocation(index) {
    this.weatherService.removeLocation(index);
  }

  toggleTemperature() {

  }

}
