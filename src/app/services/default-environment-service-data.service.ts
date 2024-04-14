import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultEnvironmentServiceDataService {

  // Hehe.
  defaultData = {"relationTypes":[{"name":"Friends","color":"Red"},{"name":"Enemy","color":"Black"},{"name":"Lover","color":"Deeppink"},{"name":"Family","color":"Green"},{"name":"Aquintance","color":"lightblue"},{"name":"Friends with benefits","color":"rgb(150, 0, 0)"}],"relations":[{"p1Name":"Ganon","p2Name":"Link","type":"Enemy"},{"p1Name":"Link","p2Name":"Zelda","type":"Lover"},{"p1Name":"Linebeck","p2Name":"Link","type":"Friends"},{"p1Name":"Teba","p2Name":"Link","type":"Friends"},{"p1Name":"Mipha","p2Name":"Sidon","type":"Lover"},{"p1Name":"Sidon","p2Name":"Link","type":"Lover"},{"p1Name":"Teba","p2Name":"Kass","type":"Aquintance"},{"p1Name":"Zelda","p2Name":"King roam","type":"Family"},{"p1Name":"Jolene","p2Name":"Linebeck","type":"Friends with benefits"}],"people":[{"name":"Ganon","picture":"https://i.imgur.com/MVmSfCJ.jpeg"},{"name":"Link","picture":"https://i.imgur.com/ae3sLhm.png"},{"name":"Zelda","picture":"https://i.imgur.com/I2ohSEa.jpeg"},{"name":"Linebeck","picture":"https://i.imgur.com/nLxx20b.png"},{"name":"Sidon","picture":"https://i.imgur.com/E2MDa4t.png"},{"name":"Teba","picture":"https://i.imgur.com/lW6HfRl.png"},{"name":"Mipha","picture":"https://i.imgur.com/oGiAc3Q.png"},{"name":"Kass","picture":"https://i.imgur.com/Q6Hu3Nr.png"},{"name":"King roam","picture":"https://i.imgur.com/JvhEV4x.png"},{"name":"Jolene","picture":"https://i.imgur.com/TTPLJaJ.jpeg"}],"placements":[{"name":"Ganon","top":226,"left":930},{"name":"Link","top":224,"left":738},{"name":"Zelda","top":224,"left":560},{"name":"Linebeck","top":67,"left":739},{"name":"Sidon","top":378,"left":932},{"name":"Teba","top":384,"left":737},{"name":"Mipha","top":381,"left":1082},{"name":"Kass","top":383,"left":562},{"name":"King roam","top":227,"left":421},{"name":"Jolene","top":67,"left":928}]};
  constructor() { }

  getDefaultData() {
    return this.defaultData;
  }
}
