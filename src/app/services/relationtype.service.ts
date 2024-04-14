import { Injectable } from '@angular/core';
import {EnvironmentService, Relation, RelationType} from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class RelationtypeService {

  constructor(private envService: EnvironmentService) { }

  getTypes(): RelationType[] {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return [];

    return environment.relationTypes;
  }

  findType(type: string): RelationType | null {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return null;

    return environment.relationTypes.find(rt => rt.name === type) ?? null;
  }

  removeRelationType(relationType: RelationType) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.relationTypes = environment.relationTypes.filter(r => r.name != relationType.name);
    this.envService.setEnvironment(environment);
  }

  addRelationType(relationType: RelationType) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.relationTypes.push(relationType);
    this.envService.setEnvironment(environment);
  }
}
