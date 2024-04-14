import { Injectable } from '@angular/core';
import {EnvironmentService, Relation} from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private envService: EnvironmentService) { }

  getRelations(): Relation[] {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return [];

    return environment.relations;
  }

  removeRelation(relation: Relation) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.relations = environment.relations.filter(r =>
      !(r.p1Name == relation.p1Name
      && r.p2Name == relation.p2Name
      && r.type == relation.type));

    this.envService.setEnvironment(environment);
  }

  addLocation(relation: Relation) {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.relations.push(relation);
    this.envService.setEnvironment(environment);
  }

  getColor(relation: Relation): string {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return 'black';

    let type = environment.relationTypes.find(type => type.name == relation.type) ?? null;
    return type?.color ?? 'black';
  }

  findRelation(name1: string, name2: string): Relation | null {
    let relations = this.getRelations();
    for (const relation of relations) {
      if (
        (relation.p1Name === name1 && relation.p2Name === name2) ||
        (relation.p1Name === name2 && relation.p2Name === name1)) {
        return relation;
      }
    }
    return null;
  }
}
