import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { DecideComponent } from 'src/description-game/component/decide/decide.component';

@Component({
  selector: 'dsc-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {
  @ViewChild('decideGame')
  decideGame: DecideComponent;

  playDescribeGame = true;
  playDecideGame = true;
  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  refreshDescribeGame() {
    this.playDescribeGame = false;
    this.cd.detectChanges();
    setTimeout(()=>{
      this.playDescribeGame = true;
      this.cd.detectChanges();
    },1);
  }

  refreshDecideGame() {
    this.playDecideGame = false;
    this.cd.detectChanges();
    setTimeout(()=>{
      this.playDecideGame = true;
      this.cd.detectChanges();
      this.decideGame.ngOnInit();
    },1);
  }
}
