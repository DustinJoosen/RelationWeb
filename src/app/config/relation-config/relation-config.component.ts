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
import {MatRadioButton, MatRadioChange, MatRadioGroup} from "@angular/material/radio";

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
    NgIf,
    MatRadioButton,
    MatRadioGroup
  ],
  providers: [
    CdkColumnDef
  ],
  templateUrl: './relation-config.component.html',
  styleUrl: './relation-config.component.css'
})
export class RelationConfigComponent implements OnInit{
  displayedColumns: string[] = ['p1Name', 'type', 'p2Name', 'feeling', 'actions'];
  dataSource = new MatTableDataSource<Relation>();

  newRelation: Relation = {
    p1Name: '',
    type: '',
    p2Name: '',
    feeling: 0,
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

    let relations = this.relationService.getRelations();

    relations.sort((a, b) => {
      if (a.p1Name < b.p1Name) return -1;
      if (a.p1Name > b.p1Name) return 1;
      return 0;
    });

    this.dataSource = new MatTableDataSource<Relation>(relations);
  }

  addType() {
    this.relationService.addRelation(this.newRelation);
    this.ngOnInit();
  }

  deleteRelation(relation: Relation) {
    this.relationService.removeRelation(relation);
    this.ngOnInit();
  }

  onFeelingChange($event: MatRadioChange, element: Relation) {
    this.relationService.removeRelation(element);
    this.relationService.addRelation(element);
  }
}

