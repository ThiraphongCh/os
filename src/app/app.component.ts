import { Component } from '@angular/core';
import { PCB } from './class/PCB';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public pcb = new PCB();   
  public time: number = 0;


  public all_Process = [] ;        //job queue
  public queue_Process = [];       //Readyqueue
  public ID_Process: number = 1;
  

  public IO = [] ;
  public Terminate = [];
  public keepQueue = [];    
  

  public process_run :String = '-' ;   //keep  process ID runnning on CPU
  public IO_run : String = '-' ;      //keep process ID run on IO  


  public awReady_time : number = 0;
  public awTurna_time : number = 0;

 

  ngOnInit() {
    this.cpuRun();
  }

  cpuRun=()=>{
    setInterval(()=>{
      this.time++;
      this.RoundRobin();
    },1000)
  }

  AddProcess=()=>{
      this.pcb = new PCB();
      this.pcb.id = this.ID_Process;
      this.pcb.status = "New";
      this.pcb.arv_Time = this.time;
      this.pcb.ready_Time = 0;
      this.pcb.ext_Time = 0;
      this.pcb.IO_runTime = 0;
      this.pcb.timeSlide = 0;
      this.pcb.IO_waitTime = 0;
      this.pcb.turn_around = 0;
      
      this.queue_Process.push(this.pcb);
      this.all_Process.push(this.pcb);
    
      this.ID_Process++; 
  }

    RoundRobin=()=>{   
      this.queue_Process.forEach((item, index)=>{ 
          if(index == 0){
            item.status = "Running";
            item.ext_Time++;
            this.process_run = item.id;
            
            item.timeSlide++;
            if(item.timeSlide == 10){
              item.timeSlide = 0;
             
              this.keepQueue.push(this.queue_Process.shift());
            }
            if(this.keepQueue.length != 0){
              this.queue_Process.push(this.keepQueue.shift());
            }
             
          }
          else{
            item.status = "Ready";
            item.ready_Time++;
          }
         
      });

        this.IO.forEach((item, index)=>{
            if(index == 0){ 
                  item.IO_runTime++;
                  item.IO_Status = "Running";     
                  this.IO_run = item.id;
            }
            else{
                item.IO_waitTime++;
               item.IO_Status = "Waitting";     
            }
        });

      
       
    }
       
    
    addIO=()=>{
       this.queue_Process.forEach((item, index)=>{ 
         if(item.status == "Running"){
             item.status = "Waitting";
             this.IO.push(this.queue_Process.shift());
          }
       }); 
     }


     closeIO=()=>{
      this.IO.forEach((item, index)=>{
        if(item.IO_Status == "Running"){
              item.status = "Ready";
              this.queue_Process.push(this.IO.shift());
        }
       });
     }
    

     terminate=()=>{
      this.all_Process.forEach((item, index)=>{
        if(item.status == "Running"){
          item.turn_around = (item.arv_Time + item.ready_Time + item.ext_Time) ;

          item.status = "Terminate";
          this.all_Process.splice(index, 1); 
          this.Terminate.push(this.queue_Process.shift());
        }

        if(this.Terminate.length > 0){
          let avg_time = 0;
          let avg_turna = 0;
          for(let i=0 ; i < this.Terminate.length; i++){
            avg_time += this.Terminate[i].ready_Time;
            avg_turna += this.Terminate[i].turn_around;
          }  
          this.awReady_time = avg_time / this.Terminate.length;
          this.awTurna_time = avg_turna / this.Terminate.length;
        }
          if(this.all_Process.length == 0){
            this.process_run = '-';
            this.IO_run = '-';
          }
      }); 
     }
}
  
 
  
  
  
  
    




