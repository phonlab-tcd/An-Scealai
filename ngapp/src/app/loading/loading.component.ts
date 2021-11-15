import {
  Component,
  Input,
} from '@angular/core';
import {TranslationService} from '../translation.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  @Input() message_key: string;

  constructor(
    public ts: TranslationService,
  ) { }
}
