import { Injectable } from "@angular/core";

import {
  Http,
  Headers,
  RequestOptions,
  ResponseContentType
} from "@angular/http";

@Injectable()
export class DataService {
  constructor(private http: Http) {
    console.log("DataService Connected...");
  }
  getUserIP() {
    return this.http.get("http://freegeoip.net/json/");
  }
  getBlobData(url: string) {
    return this.http.get(url, { responseType: ResponseContentType.Blob });
  }
  openGet(url) {
    return this.http.get(url);
  }
  openPost(url, data) {
    return this.http.post(url, data);
  }
  authPost(url, data, auth_token) {
    let headers = new Headers({ Authorization: "Bearer " + auth_token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, options);
  }
  authGet(url, auth_token) {
    let headers = new Headers({ Authorization: "Bearer " + auth_token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }
}

/*
    openPut(url, data) {
      let headers = new Headers({ "Access-Control-Allow-Origin": "*" });
      let options = new RequestOptions({ headers: headers });
      var qurl = appInfo.corsUrl + btoa(url);
      return this.http.put(qurl, data);
    }
    openPost(url, data) {
      let headers = new Headers({ "Access-Control-Allow-Origin": "*" });
      let options = new RequestOptions({ headers: headers });
      var qurl = appInfo.corsUrl + btoa(url);
      return this.http.post(qurl, data);
    }
    openDelete(url) {
      let headers = new Headers({ "Access-Control-Allow-Origin": "*" });
      let options = new RequestOptions({ headers: headers });
      var qurl = appInfo.corsUrl + btoa(url);
      return this.http.delete(qurl);
    }
    authStdGet(app_token, url) {
      let headers = new Headers({ Authorization: "Bearer " + app_token });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(url, options);
    }
    authStdPut(app_token, url, data) {
      let headers = new Headers({ Authorization: "Bearer " + app_token });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(url, data, options);
    }
    authStdPost(app_token, url, data) {
      let headers = new Headers({ Authorization: "Bearer " + app_token });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(url, data, options);
    }
    uploadFile(url, data) {
      let headers = new Headers({ "x-ms-blob-type": "blockblob" });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(url, data, options);
    }*/
