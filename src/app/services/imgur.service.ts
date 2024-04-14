import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImgurService {
  private secretKey = 'cb6485111afbb57';

  constructor(private http: HttpClient) { }

  async uploadImage(image: File): Promise<any> {
    console.log(image);
    const data = new FormData();
    data.append('image', image);

    const headers = new HttpHeaders({
      Authorization: 'Client-ID '+ this.secretKey
    });

    return await firstValueFrom(this.http.post<any>('https://api.imgur.com/3/image', data, {headers}));
  }
}
