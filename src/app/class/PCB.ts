export class PCB{
    id : number;
    status: "New" | "Ready" | "Running" | "Waitting" | "Terminate" ;
    arv_Time : number ;
    ext_Time : number;
    ready_Time : number;
    timeSlide: number;

    // IO
    IO_waitTime : number;
    IO_runTime : number;

    turn_around : number;  
}
