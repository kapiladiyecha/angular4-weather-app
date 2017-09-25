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
  locations: any[];
  weatherDetails: any;
  locationAutocomplete: any;
  locationForm: FormGroup;
  currentLocation: any;
  loadedLocation: any;
  isForecast = false;
  location = new FormControl('', Validators.required);
  isLoading = true;
  isFahrenheit = false;

  constructor(private _cacheService: CacheService,
              public weatherService: WeatherService) {
  }

  ngOnInit() {
    this.google = window["google"];
    this.createFormControl();
    this.setCurrentLocation();
    // this.initAutoComplete();
    this.locations = this.weatherService.getAllLocation();
    window['weatherComponent'] = this;
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
    this.locationAutocomplete = new this.google.maps.places.Autocomplete(element);
    window['weatherComponentLA'] = this.locationAutocomplete;
    this.google.maps.event.addListener(this.locationAutocomplete, 'place_changed', () => {
      var place = this.locationAutocomplete.getPlace();
      var address = place.formatted_address;
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var mesg = "Address: " + address;
      mesg += "\nLatitude: " + latitude;
      mesg += "\nLongitude: " + longitude;
      console.log(mesg);

      window['weatherComponent'].loadedLocation = place;
      window['weatherComponent'].isLoading = true;
      window['weatherComponent'].patchDigest();

      window['weatherComponent'].weatherService.getWoeByLatLong(latitude + "," + longitude).subscribe(result => {
        if (result && result.length > 0) {
          window['weatherComponent'].weatherService.getWeatherByWoeId(result[0]['woeid']).subscribe(result => {
            window['weatherComponent'].setWeatherDetails(result);
          });
        }
      });
    });
    // });
  }

  /**
   *
   * @param details
   */
  setWeatherDetails(details) {
    this.weatherDetails = details;
    this.isLoading = false;
    this.patchDigest();
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
          this.loadedLocation = results[0];
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

  /**
   *
   * @param weatherService
   */
  onLocationChange() {
    this.isLoading = true;
    this.currentLocation = this.loadedLocation;
    let geometryLocation = this.currentLocation.geometry.location;
    let latitude = (typeof geometryLocation.lat === 'function') ? geometryLocation.lat() : geometryLocation.lat;
    let longitude = (typeof geometryLocation.lng === 'function') ? geometryLocation.lng() : geometryLocation.lng;
    this.weatherService.getWoeByLatLong(latitude + "," + longitude).subscribe(result => {
      if (result && result.length > 0) {
        this.weatherService.getWeatherByWoeId(result[0]['woeid']).subscribe(result => {
          this.weatherDetails = result;
          this.isLoading = false;
        });
      }
    });
  }

  ngAfterViewInit() {

  }

  togglePrediction() {
    this.isForecast = !this.isForecast;
  }

  saveLocation() {
    /*this.location.setValue((document.getElementById('txtPlaces')  as HTMLTextAreaElement).value);*/
    this.weatherService.addLocation(this.loadedLocation);
    this.locations = this.weatherService.getAllLocation();
  }

  removeLocation(index) {
    this.weatherService.removeLocation(index);
    this.locations = this.weatherService.getAllLocation();
  }

  toggleTemperature() {
    this.isFahrenheit = !this.isFahrenheit;
  }

  refreshTemperature() {
    this.getWeatherByLocation(this.loadedLocation);
  }

  getWeatherByLocation(location) {
    this.loadedLocation = location;
    this.location.setValue(location.formatted_address);
    this.onLocationChange();
    /* this.isLoading = true;
     this.weatherService.getWoeByLatLong(location.geometry.location.lat + "," + location.geometry.location.lng).subscribe(result => {
       if (result && result.length > 0) {
         this.weatherService.getWeatherByWoeId(result[0]['woeid']).subscribe(result => {
           this.setWeatherDetails(result);
           this.isLoading = false;
         });
       }
     });*/
  }

  patchDigest() {
    document.getElementById('txtPlaces').blur();
    document.getElementById('txtPlaces').focus();
  }

}
