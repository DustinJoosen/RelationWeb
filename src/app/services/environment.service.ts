import { Injectable } from '@angular/core';
import {DefaultEnvironmentServiceDataService} from "./default-environment-service-data.service";

export interface RelationType {
  name: string;
  color: string;
}
export interface Person {
  name: string;
  picture?: string;
}
export interface Placement {
  name: string;
  top: number;
  left: number;
}
export interface Relation {
  p1Name: string,
  p2Name: string,
  type: string
}

export interface Environment {
  relationTypes: RelationType[];
  relations: Relation[];
  people: Person[];
  placements: Placement[];
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(defaultEnvironmentServiceDataService: DefaultEnvironmentServiceDataService) {
    try {
      // Instantiate a default environment object in the localstorage.
      if (localStorage.getItem('environment') == null) {
        localStorage.setItem('environment', JSON.stringify(defaultEnvironmentServiceDataService.getDefaultData()));
      }
    }
    catch (e) {
      console.log("Could not set default environment data");
    }
  }

  getEnvironment(): Environment | null {
    let json;

    try {
      json = localStorage.getItem('environment');
    } catch (e) {
      console.log("Could not access localStorage (read)");
    }

    if (json == null)
      return null;

    return JSON.parse(json) as Environment;
  }

  setEnvironment(environment: Environment) {
    let json = JSON.stringify(environment);

    try {
      localStorage.setItem('environment', json);
    } catch (e) {
      console.log("Could not access localStorage (create)")
    }
  }
}
