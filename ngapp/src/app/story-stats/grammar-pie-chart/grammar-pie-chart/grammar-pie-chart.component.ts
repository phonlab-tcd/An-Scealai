import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import config from 'abairconfig';

@Component({
  selector: 'app-grammar-pie-chart',
  templateUrl: './grammar-pie-chart.component.html',
  styleUrls: ['./grammar-pie-chart.component.scss']
})
export class GrammarPieChartComponent implements OnInit {
  
  @Input() data:Object;
  dataLabels:string[] = [];
  dataValues:number[] = [];
  backgroundColors:string[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    if(this.data) {
      this.dataLabels = Object.keys(this.data);
      this.dataValues = Object.values(this.data);
      for(let i = 0; i < this.dataValues.length; i++) {
        this.backgroundColors.push("#" + ((Math.random() * 0xffffff) << 0).toString(16));
      }
      this.makePieChart()
    }
  }
  
  private makePieChart() {
    let canvasElem = document.getElementById("grammar-pie-chart") as HTMLCanvasElement;
    let ctx = canvasElem.getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: this.dataLabels,
            datasets: [{
                label: 'Grammar Error Counts ',
                data: this.dataValues,
                backgroundColor: this.backgroundColors,
            }]
        },
    });
  }

}
