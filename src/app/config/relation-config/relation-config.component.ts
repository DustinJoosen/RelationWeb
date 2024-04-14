import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CdkColumnDef} from "@angular/cdk/table";
import {EnvironmentService, Person, Relation, RelationType} from "../../services/environment.service";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, NgIf} from "@angular/common";
import {RelationService} from "../../services/relation.service";

@Component({
  selector: 'app-relation-config',
  standalone: true,
  imports: [
    MatTableModule,
    MatButton,
    MatFormField,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgIf
  ],
  providers: [
    CdkColumnDef
  ],
  templateUrl: './relation-config.component.html',
  styleUrl: './relation-config.component.css'
})
export class RelationConfigComponent implements OnInit{
  displayedColumns: string[] = ['p1Name', 'type', 'p2Name', 'actions'];
  dataSource = new MatTableDataSource<Relation>();

  newRelation: Relation = {
    p1Name: '',
    type: '',
    p2Name: ''
  };

  people: Person[] = [];
  relationTypes: RelationType[] = [];

  constructor(private envService: EnvironmentService, private relationService: RelationService) { }

  ngOnInit() {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    this.relationTypes = environment.relationTypes;
    this.people = environment.people;

    this.dataSource = new MatTableDataSource<Relation>(this.relationService.getRelations());
  }

  addType() {
    this.relationService.addLocation(this.newRelation);
    this.ngOnInit();
  }

  deleteRelation(relation: Relation) {
    this.relationService.removeRelation(relation);
    this.ngOnInit();
  }
}

