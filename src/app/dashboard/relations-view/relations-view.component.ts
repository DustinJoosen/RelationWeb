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
import {After} from "v8";

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
export class RelationsViewComponent implements OnInit, AfterViewInit {
  @ViewChildren('element') elements?: QueryList<ElementRef>;

  public people: Person[] = [];
  private relations: Relation[] = [];

  public connections: Connection[] = [];

  public buttonsVisible = true;

  // 0 = move
  // 1 = relation
  // 2 = link
  public mode: number = 2;

  public relationChangerElements: string[] = [];
  selectedType?: RelationType | null;
  selectedPerson: Person = {name: 'Skull Kid'};

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
    if (event.key === 'L' || event.key == 'l') {
      this.setMode(2);
    }
    if (event.key === 'p') {
      this.loadPlacement();
    }

    if (event.key === 's' || event.key === 'S') {
      this.savePlacement();
      location.reload();
    }

    if (event.key === 'Delete') {
      if (this.mode == 1 && this.relationChangerElements.length == 2) {
        this.deleteSelectedRelation();
      }
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    setTimeout(() => {
      this.loadPlacement();
    }, 50);

  }

  relatedToCurrentSelectedPerson(person: Person) {
    if (person.name === this.selectedPerson.name) {
      return true;
    }

    let relation = this.relationsService.getRelations().find(relation => {
      if (relation.p1Name == person.name && relation.p2Name == this.selectedPerson.name) {
        return true;
      }
      if (relation.p2Name == person.name && relation.p1Name == this.selectedPerson.name) {
        return true;
      }
      return false;
    });

    return relation != null;
  }

  getRelationToCurrentSelectedPerson(person: Person) {
    if (person.name === this.selectedPerson.name) {
      return null;
    }

    return this.relationsService.getRelations().find(relation => {
      if (relation.p1Name == person.name && relation.p2Name == this.selectedPerson.name) {
        return relation;
      }
      if (relation.p2Name == person.name && relation.p1Name == this.selectedPerson.name) {
        return relation;
      }

      return null;
    });
  }

  cssClassOfPerson(person: Person) {
    let css = "";

    if (this.relationChangerElements.includes(person.name)) {
      css += "selected-person ";
    }

    if (this.selectedPerson.name === person.name) {
      css += "selected-person ";
    }

    if (this.mode === 2 && !this.relatedToCurrentSelectedPerson(person)) {
      css += "hidden-person ";
    }

    if (this.mode === 2) {
      let relation = this.getRelationToCurrentSelectedPerson(person);
      if (relation != null) {
        if (relation.feeling == -1) {
          css += "person-with-negative-relation";
        } else if (relation.feeling == 0) {
          css += "person-with-neutral-relation";
        } else {
          css += "person-with-positive-relation";
        }

      }
    }


    return css;
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

      const scrollLeft = window.scrollX;
      const scrollTop = window.scrollY;

      this.connections.push({
        relation: relation,
        line: {
          sx: (r1.left + r1.width / 2) + scrollLeft,
          sy: (r1.top + r1.height / 2) + scrollTop,
          ex: (r2.left + r2.width / 2) + scrollLeft,
          ey: (r2.top + r2.height / 2) + scrollTop,
          color: this.relationsService.getColor(relation)
        }
      })
    })
  }

  update($event: CdkDragMove) {
    this.refreshLines($event);
    // this.savePlacement();
  }

  setMode(mode: number) {
    this.mode = mode;
    this.relationChangerElements = [];
    this.selectedPerson = { name: ''};
  }

  trySelectRelation(name: string) {
    if (this.mode === 1) {
      if (!this.relationChangerElements.includes(name)) {
        if (this.relationChangerElements.length >= 2) {
          this.relationChangerElements = this.relationChangerElements.slice(1);
        }
        this.relationChangerElements.push(name);
      } else {
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

    if (this.mode === 2) {
      let person = this.personService.getPeople().find(person => person.name === name);
      if (person == null) {
        return;
      }

      this.selectedPerson = person;
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
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.relationsService.addRelation({
          p1Name: name1,
          p2Name: name2,
          type: result,
          feeling: 0,
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
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (relation == null)
          return;

        this.relationsService.removeRelation(relation);
        this.relationsService.addRelation({
          p1Name: name1,
          p2Name: name2,
          type: result,
          feeling: result
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
      let rect: DOMRect = (document.getElementById(id)?.getBoundingClientRect() ?? defaultBox) as DOMRect;

      environment?.placements.push({
        'name': person.name,
        'top': rect?.y + window.scrollY,
        'left': rect?.x + window.scrollX
      })
    });

    this.envService.setEnvironment(environment);
  }

  loadPlacement() {
    let environment = this.envService.getEnvironment();
    if (environment == null)
      return;

    // const scrollLeft = window.scrollX;
    // const scrollTop = window.scrollY;

    environment.placements.forEach(placement => {
      let id = 'p-' + placement.name.replace(' ', '_');
      let rect = document.getElementById(id);
      if (rect == null)
        return;

      rect.style!.top = placement.top + 'px';
      rect.style!.left = placement.left + 'px';
    });
  }

  lineShouldAppear(connection: Connection) {
    let people = this.personService.getPeople();
    let p1 = people.find(p => p.name === connection.relation.p1Name);
    let p2 = people.find(p => p.name === connection.relation.p2Name);

    if (p1 == null || p2 == null) {
      return false;
    }

    if (!this.relatedToCurrentSelectedPerson(p1)) {
      return false;
    }

    if (!this.relatedToCurrentSelectedPerson(p2)) {
      return false;
    }

    return true;
  }

  lineClass(connection: Connection) {
    if (this.mode != 2) {
      return '';
    }

    if (!this.lineShouldAppear(connection)) {
      return 'line-invisible';
    }

    return '';
  }

  ngAfterViewInit(): void {
    this.loadPlacement();
    this.refreshLines();
  }
}
