import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../classroom.service';
import { AuthenticationService } from '../../authentication.service';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Classroom } from '../../classroom';
import { User } from '../../user';
import { StatsService } from '../../stats.service';
import { StudentStats } from '../../studentStats';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-teacher-stats',
  templateUrl: './teacher-stats.component.html',
  styleUrls: ['./teacher-stats.component.css']
})
export class TeacherStatsComponent implements OnInit {
  teacherId: string = '';
  classroom: Classroom;
  classroomId: string = '';
  students: User[] = [];
  stats: StudentStats[] = [];
  totalStats: Map<string, number> = new Map();
  myChart: any;
  graphLabels: string[] = [];
  graphValues: number[] = [];
  colorValues: string[] = [];

  constructor(private classroomService: ClassroomService, private auth: AuthenticationService, 
              private userService: UserService, private router: Router,
              private route: ActivatedRoute,
              private statsService : StatsService) { }

  ngOnInit() {
    this.getClassroom();
    // Generate colors to fill the grammar error pie chart
    for(let i = 0; i < 50; i++) {
      let color: string = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      this.colorValues.push(color);
    }
  }
  
  /*
  * Get classroom id from route parameters
  */
    getClassroomId(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.route.params.subscribe(
          params => {
            resolve(params);
        });
      });
    }

  /*
  * Get classroom id with function and call getClassroom with classroom service
  * call function to get list of students
  */
    getClassroom() {
      this.getClassroomId().then((params) => {
        let id: string = params.id.toString();
        this.classroomService.getClassroom(id).subscribe((res : Classroom) => {
          this.classroom = res;
          this.classroomId = this.classroom._id;
          this.teacherId = this.classroom.teacherId;
          console.log(this.classroom);
          this.getStudents();
          this.getStatsForStudents();
        });
      });
    }

  /*
  * Loop through student ids in classroom object to get student objects
  */
    getStudents() {
      for(let id of this.classroom.studentIds) {
        this.userService.getUserById(id).subscribe((res : User) => {
          this.students.push(res);
        });
      }
    }
    
  /*
  * Get the grammar errors for each student and add to stats array
  */  
    getStatsForStudents() {
      this.statsService.getStatsForClassroom(this.classroomId).subscribe( (res: StudentStats[]) => {
        this.stats = res;
        /*
        for( let s of this.stats) {
          console.log("Stat entry:");
          console.log("student id: " + s.studentUsername);
          console.log("Class id: " + s.classroomId);
          console.log(s.grammarErrors);
        }
        */
        this.getStatsForClass();
      });
    }
    
  /*
  * Loop through stats arry and get the total number of errors for each grammar
  * rule that the students make as a class
  */
    getStatsForClass() {
      for(let entry of this.stats) {
        for(let error of Object.entries(entry.grammarErrors)) {
          
          let originalAmount = this.totalStats.get(error[0]);
          //console.log("type of original amount: " +  originalAmount);
        //  console.log("type of map object: " + typeof );
          //console.log("original amount: " + originalAmount);
        //  console.log("error[1]: " + error[1]);
          if(originalAmount == null || isNaN(originalAmount)) {
            this.totalStats.set(error[0], error[1]);
          }
          else {
            let newAmount = (originalAmount + error[1]);
            //console.log("New amount: " + newAmount);
            this.totalStats.set(error[0], newAmount);
          }
          //console.log(this.totalStats);
        }
      }
  
      for (let entry of Array.from(this.totalStats.entries())) {
        console.log(entry[0]);
        this.graphLabels.push(entry[0]);
        this.graphValues.push(entry[1]);
      }
      this.createChart(this.graphLabels, this.graphValues);

    }
    
    createChart(labels, values) {
      
      this.myChart = new Chart('statChart', {  
        type: 'doughnut',  
        data: {  
          labels: labels,  
          datasets: [  
            {  
              data: values,   
              backgroundColor: this.colorValues,  
              fill: true  
            }  
          ]  
        },  
        options: {  
          legend: {  
            display: true  
          },  
          scales: {  
            xAxes: [{  
              display: false  
            }],  
            yAxes: [{  
              display: false  
            }],  
          }  
        },
        responsive: true,
        maintainAspectRatio: false
      }); 
    }

  /*
  * Go back to dashboard when button clicked
  */
  goBack() {
    this.router.navigateByUrl('teacher/classroom/' + this.classroom._id);
  }
  

}
