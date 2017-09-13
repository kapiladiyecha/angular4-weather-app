/**
 * author: Kapil Adiyecha
 */
import {Injectable} from '@angular/core';
import {CacheService} from "ng2-cache-service";
import {Http} from "@angular/http";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class WeatherService {

  constructor(private _cacheService: CacheService,
              private httpClient: HttpClient,
              private http: Http
  ) {
  }

  /**
   *
   * @param place
   * @returns {any[]}
   */
  addLocation(place): any[] {
    debugger;
    let locations = [];
    if (this._cacheService.exists("location")) {
      locations = this._cacheService.get('location');
    }
    if(locations.indexOf(place) == -1){
      locations.push(place);
      this._cacheService.set('location', locations);
    }
    return locations;
  }


  /**
   *
   * @param index
   * @returns {any[]}
   */
  removeLocation(index): any[] {
    let locations = this._cacheService.get('location');
    locations.splice(index, 1);
    this._cacheService.set('location', locations);
    return locations;
  }


  /**
   *
   * @returns {any[]}
   */
  getAllLocation(): any[] {
    return this._cacheService.get('location');
  }


  /**
   *
   * @param label
   * @param lat
   * @param long
   * @returns {any[]}
   */
  fetchWeatherDetails(label, lat, long): any[] {

    //TODO: write api code here

    return [];
  }


  /**
   *
   * @param latlong
   */
  getWoeByLatLong(latlong): Observable<any> {

    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get('https://www.metaweather.com/api/location/search/?lattlong=' + latlong, {headers: headers}).map(
      (response: Response) => {
        return response;
      }
    );

  }
  /**
   *
   * @param woeId
   */
  getWeatherByWoeId(woeId): Observable<any> {
   /* let headers = new HttpHeaders({'Content-Type': 'application/json'});
    headers.append('accept','*!/!*');
    headers.append('origin','http://evil.com/');
    headers.append('referer','http://localhost:4600/');*/
    return this.http.get('https://www.metaweather.com/api/location/' + woeId).map(res => res.json());

  }

}
