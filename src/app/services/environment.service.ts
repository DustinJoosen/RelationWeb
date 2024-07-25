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
  type: string,
  feeling: number, // -1 = negative, 0 = neutral, 1 = positive
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

    // A temporary method that gets updated everytime a data migration is needed.
    this.updateDataWithNewFields(json);

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

  private updateDataWithNewFields(js2on: string) {

    let json;
    try {
      json = localStorage.getItem('environment');
    } catch (e) {
      console.log("Could not access localStorage (read)");
    }

    if (json == null)
      return null;

    let data = JSON.parse(json);
    data["relations"].forEach((relation) => {
      relation["feeling"] = 0;
    });

    localStorage.setItem("environment", JSON.stringify(data));
  }
}

