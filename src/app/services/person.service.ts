import { Injectable } from '@angular/core';
import {EnvironmentService, Person, Relation} from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private envService: EnvironmentService) { }

  getPeople(): Person[] {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return [];

    return environment.people;
  }

  removePerson(person: Person) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.people = environment.people.filter(p => p.name != person.name);

    this.envService.setEnvironment(environment);
  }

  addPerson(person: Person) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.people.push(person);
    this.envService.setEnvironment(environment);
  }

  addPicture(person: Person) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    for (let i = 0; i < environment.people.length; i++) {
      if (environment.people[i].name === person.name) {
        environment.people[i].picture = person.picture;
      }
    }

    this.envService.setEnvironment(environment);
  }
}
