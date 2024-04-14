import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {RelationsViewComponent} from "./dashboard/relations-view/relations-view.component";
import {RelationTypeConfigComponent} from "./config/relation-type-config/relation-type-config.component";
import {PeopleConfigComponent} from "./config/people-config/people-config.component";
import {RelationConfigComponent} from "./config/relation-config/relation-config.component";

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: RelationsViewComponent },
  { path: 'config/types', component: RelationTypeConfigComponent },
  { path: 'config/people', component: PeopleConfigComponent },
  { path: 'config/relations', component: RelationConfigComponent }
];
