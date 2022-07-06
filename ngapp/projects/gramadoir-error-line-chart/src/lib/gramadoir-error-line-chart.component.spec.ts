import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GramadoirErrorLineChartComponent } from './gramadoir-error-line-chart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgChartsModule } from 'ng2-charts';
import { of } from 'rxjs';

const ObjectId = String;
const ISODate = x=>new Date(x);

const story = {
  _id: ObjectId("62822a81c3a1146519289290"),
  feedback: { seenByStudent: null, text: null, audioId: null },
  title: 'teideal',
  date: ISODate("2022-05-16T10:44:31.897Z"),
  dialect: 'connemara',
  text: 'an bhfuil botúin sa théacs seo\n\nnew text\n',
  htmlText: '<p>an bhfuil botúin sa théacs seo</p><p><br></p><p>new text</p>',
  author: 'neimhinS',
  studentId: '62822a22c3a114651928923e',
  lastUpdated: ISODate("2022-06-15T16:52:36.033Z"),
  activeRecording: '62aa0ddec3a11465192a56d1',
  __v: 0
};
const storyHistory = {
  storyId: "62822a81c3a1146519289290",
  userId: "62822a22c3a114651928923e",
  versions: [
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-05-16T10:42:25.116Z")
    },
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-05-16T10:44:25.607Z")
    },
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-05-16T11:00:38.074Z")
    },
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-05-16T11:02:38.269Z")
    },
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-06-15T16:49:38.646Z")
    },
    {
      gramadoirCacheId: ObjectId("62822a91fd38f9f72f4a3162"),
      timestamp: ISODate("2022-06-15T16:49:57.506Z")
    },
    {
      gramadoirCacheId: ObjectId("62aa0dbc36ba9f7ff433b70c"),
      timestamp: ISODate("2022-06-15T16:50:04.786Z")
    }
  ]
}

const gramadoirCache = {
  "62822a91fd38f9f72f4a3162": {
    _id: ObjectId("62822a91fd38f9f72f4a3162"),
    text: 'an bhfuil botúin sa théacs seo ',
    __v: 0,
    grammarTags: [
      {
        _id: ObjectId("62aa0db5c3a11465192a5679"),
        start: 17,
        length: 9,
        type: 'NICLAOCHLU',
        messages: {
          en: 'Unnecessary initial mutation',
          ga: 'Urú nó séimhiú gan ghá'
        }
      }
    ]
  },
  "62aa0dbc36ba9f7ff433b70c": {
    _id: ObjectId("62aa0dbc36ba9f7ff433b70c"),
    text: 'an bhfuil botúin sa théacs seo  new text ',
    __v: 0,
    grammarTags: [
      {
        _id: ObjectId("62aa0dbcc3a11465192a56a8"),
        start: 17,
        length: 9,
        type: 'NICLAOCHLU',
        messages: {
          en: 'Unnecessary initial mutation',
          ga: 'Urú nó séimhiú gan ghá'
        }
      },
      {
        _id: ObjectId("62aa0dbcc3a11465192a56a9"),
        start: 32,
        length: 3,
        type: 'MOLADH',
        messages: { en: 'Unknown word: /New/?', ga: 'Focal anaithnid: ‘New’?' }
      },
      {
        _id: ObjectId("62aa0dbcc3a11465192a56aa"),
        start: 36,
        length: 4,
        type: 'GRAM',
        messages: {
          en: 'Possibly a foreign word (the sequence /tex/ is highly improbable)',
          ga: "B'fhéidir gur focal iasachta é seo (tá na litreacha ‘tex’ neamhchoitianta)"
        }
      }
    ]
  }
}

describe('GramadoirErrorLineChartComponent', () => {
  let component: GramadoirErrorLineChartComponent;
  let fixture: ComponentFixture<GramadoirErrorLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GramadoirErrorLineChartComponent ],
      imports: [
        NgChartsModule.forRoot(),
        HttpClientTestingModule,
      ],
    })
    .compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(GramadoirErrorLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component,'fetchStoryHistory').and
      .returnValue(Promise.resolve(storyHistory));
  });

  fit('should have label data after setting storyId', async ()=> {
    component.storyId = story._id;
    await fixture.whenStable().then(
      ()=>expect(component.lineChartData.labels.length)
      .toBe(storyHistory.versions.length));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
