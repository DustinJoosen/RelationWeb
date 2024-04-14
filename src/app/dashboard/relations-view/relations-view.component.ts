import {AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import {RelationService} from "../../services/relation.service";
import {CdkDragMove, DragDropModule} from "@angular/cdk/drag-drop";
import {RouterLink, RouterOutlet} from "@angular/router";
import {CommonModule, NgFor} from "@angular/common";
import {EnvironmentService, Person, Placement, Relation, RelationType} from "../../services/environment.service";
import {PersonService} from "../../services/person.service";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {CreateEditDialogueComponent} from "../create-edit-dialogue/create-edit-dialogue.component";
import {LegendaComponent} from "../legenda/legenda.component";
import {RelationtypeService} from "../../services/relationtype.service";

interface Connection {
  line: Line,
  relation: Relation
}

interface Line {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  color: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const defaultBox: Box = {
  width: 50,
  height: 0,
  left: 0,
  top: 0
};

@Component({
  selector: 'app-relations-view',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgFor, DragDropModule, MatIcon, RouterLink, LegendaComponent],
  templateUrl: './relations-view.component.html',
  styleUrl: './relations-view.component.css'
})
export class RelationsViewComponent implements OnInit {
  @ViewChildren('element') elements?: QueryList<ElementRef>;

  public people: Person[] = [];
  private relations: Relation[] = [];

  public connections: Connection[] = [];

  public buttonsVisible = true;

  // 0 = move
  // 1 = relation
  public mode: number = 0;

  public relationChangerElements: string[] = [];
  selectedType?: RelationType | null;

  constructor(private relationsService: RelationService,
              private personService: PersonService,
              private typeService: RelationtypeService,
              private envService: EnvironmentService,
              public dialog: MatDialog) {}

  async ngOnInit() {
    this.relations = this.relationsService.getRelations();
    this.people = this.personService.getPeople();

    this.selectedType = this.typeService.getTypes()[1];

    setTimeout(() => {
      this.randomizeLocations();
      this.loadPlacement();
      this.refreshLines();
    }, 0);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F1') {
      this.buttonsVisible = !this.buttonsVisible;
      event.preventDefault();
    }
    if (event.key === 'M' || event.key === 'm') {
      this.setMode(0);
    }
    if (event.key === 'R' || event.key === 'r') {
      this.setMode(1);
    }
    if (event.key === 'Delete') {
      if (this.mode == 1 && this.relationChangerElements.length == 2) {
        this.deleteSelectedRelation();
      }
    }
  }

  randomizeLocations() {
    for (let i = 0; i < this.people.length; i++) {

      let x, y;
      try {
        x = Math.floor(Math.random() * (window.innerWidth - 300));
        y = Math.floor(Math.random() * (window.innerHeight - 300));
      } catch {
        console.log("Window with didn't work");
      }

      try {
        let underscored_name = this.people[i].name.replace(' ', '_');
        let id: string = "p-" + underscored_name;

        console.log(id);

        let elem = document.getElementById(id);

        if (elem == null) return;
        elem.style.left = x + "px";
        elem.style.top = y + "px";
      } catch {
        console.log("yo...wtf")
      }

    }
  }

  refreshLines($event?: CdkDragMove) {
    this.relations = this.relationsService.getRelations();
    this.connections = [];

    this.relations.forEach(relation => {
      let r1: Box;
      let r2: Box;

      try {
        r1 = document.getElementById("p-" + relation.p1Name.replace(' ', '_'))?.getBoundingClientRect() ?? defaultBox;
        r2 = document.getElementById("p-" + relation.p2Name.replace(' ', '_'))?.getBoundingClientRect() ?? defaultBox;
      } catch {
        return;
      }

      this.connections.push({
        relation: relation,
        line: {
          sx: r1.left + r1.width / 2,
          sy: r1.top + r1.height / 2,
          ex: r2.left + r2.width / 2,
          ey: r2.top + r2.height / 2,
          color: this.relationsService.getColor(relation)
        }
      })
    })
  }

  update($event: CdkDragMove) {
    this.refreshLines($event);
    this.savePlacement();
  }

  setMode(mode: number) {
    this.mode = mode;
    this.relationChangerElements = [];
  }

  trySelectRelation(name: string) {
    if (this.mode !== 1)
      return;

    if (!this.relationChangerElements.includes(name)) {
      if (this.relationChangerElements.length >= 2) {
        this.relationChangerElements = this.relationChangerElements.slice(1);
      }
      this.relationChangerElements.push(name);
    }
    else {
      for (let i = 0; i < this.relationChangerElements.length; i++) {
        if (this.relationChangerElements[i] === name) {
          this.relationChangerElements = this.relationChangerElements.filter(rce => rce !== name)
        }
      }
    }

    // Legenda selector
    let relation = this.relationsService.findRelation(this.relationChangerElements[0], this.relationChangerElements[1]);
    if (relation !== null) {
      this.selectedType = this.typeService.findType(relation.type);
    } else {
      this.selectedType = null;
    }
  }

  relationExists(): boolean {
    if (this.relationChangerElements.length != 2) {
      return false;
    }

    let name1 = this.relationChangerElements[0];
    let name2 = this.relationChangerElements[1];

    let relations = this.relationsService.getRelations();
    for (const relation of relations) {
      if ((relation.p1Name === name1 && relation.p2Name === name2) ||
           relation.p2Name === name1 && relation.p1Name === name2) {
        return true;
      }
    }
    return false;
  }

  deleteSelectedRelation() {
    let name1 = this.relationChangerElements[0];
    let name2 = this.relationChangerElements[1];

    let relation = this.relationsService.findRelation(name1, name2);
    if (relation == null)
      return;

    this.relationsService.removeRelation(relation);
    this.refreshLines();
  }

  createSelectedRelation() {
    if (this.relationChangerElements.length != 2)
      return;

    let name1 = this.relationChangerElements[0];
    let name2 = this.relationChangerElements[1];

    let relation = this.relationsService.findRelation(name1, name2);
    if (relation != null)
      return;

    const dialogRef = this.dialog.open(CreateEditDialogueComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.relationsService.addLocation({
          p1Name: name1,
          p2Name: name2,
          type: result
        });
        this.refreshLines();
      }
    });
  }

  editSelectedRelation() {
    if (this.relationChangerElements.length != 2)
      return;

    let name1 = this.relationChangerElements[0];
    let name2 = this.relationChangerElements[1];

    let relation = this.relationsService.findRelation(name1, name2);
    if (relation == null)
      return;

    const dialogRef = this.dialog.open(CreateEditDialogueComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (relation == null)
          return;

        this.relationsService.removeRelation(relation);
        this.relationsService.addLocation({
          p1Name: name1,
          p2Name: name2,
          type: result
        });
        this.refreshLines();
      }
    });
  }

  selectLine(relation: Relation) {
    this.relationChangerElements = [];
    this.trySelectRelation(relation.p1Name);
    this.trySelectRelation(relation.p2Name);
  }

  savePlacement() {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.placements = [];
    this.people.forEach(person => {
      let id = 'p-' + person.name.replace(' ', '_');
      let rect = document.getElementById(id)?.getBoundingClientRect() ?? defaultBox;

      environment?.placements.push({
        'name': person.name,
        'top': rect?.top,
        'left': rect?.left
      })
    });

    this.envService.setEnvironment(environment);
  }

  loadPlacement() {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    environment.placements.forEach(placement => {
      let id = 'p-' + placement.name.replace(' ', '_');
      let rect = document.getElementById(id);
      if (rect == null)
        return;

      rect.style!.top = placement.top + 'px';
      rect.style!.left = placement.left + 'px';
    });
  }
}
