import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { sentences } from '../data/sentences'

@Injectable({
  providedIn: 'root'
})

export class TtsService {
  private apiUrl = "https://abair.ie/api2/synthesise"
  //private apiUrl = "https://scealai-dashboard-server.herokuapp.com/api/v1/getIrishSynthesis"
  //private apiUrl = "http://localhost:5000/api/v1/getIrishSynthesis"
  constructor(private http:HttpClient) { }

  getTTS = text => {
    let apiData = {
      "synthinput": {
        "text": text,
        "ssml": "string"
      },
      "voiceparams": {
        "languageCode": "ga-IE",
        "name": "ga_UL_anb_nnmnkwii",
        "ssmlGender": "UNSPECIFIED"
      },
      "audioconfig": {
        "audioEncoding": "LINEAR16",
        "speakingRate": 1,
        "pitch": 1,
        "volumeGainDb": 1,
        "sampleRateHertz": 0,
        "effectsProfileId": []
      },
      "outputType": "JSON",
      "timing": "BOTH"
    }
    return this.http.post<any>(this.apiUrl, apiData)
  }
}
