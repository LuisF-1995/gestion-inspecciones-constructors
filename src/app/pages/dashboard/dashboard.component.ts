import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { localTokenKeyName, localUserIdKeyName } from '../../../constants/GlobalData';
import { login } from '../../../constants/Routes';
import { gestionInspeccionesUrl } from '../../../constants/Api';

@Component({
  selector: 'page-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  validToken:boolean = false;
  userData:{
    id: number;
    email: string;
    nombres: string;
    tipoDocumento:string;
    numeroDocumento:number;
    matriculaProfesional:string;
    direccionDomicilio:string;
    firmaConstructor:string;
    telefono: string;
    proyectosConstructor: any[];
    qrConstructor:string;
    rol: string;
  } | null = null;
  showSpinner:boolean = false;
  spinnerMessage:string = "";

  constructor(private dashBoardService:DashboardService, private router:Router){}

  ngOnInit(): void {
    this.showSpinner = true;
    this.spinnerMessage = `Validando información de usuario`;
    if( typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(localTokenKeyName) && localStorage.getItem(localUserIdKeyName)){
      this.dashBoardService.validateToken(gestionInspeccionesUrl, `constructores/id/${localStorage.getItem(localUserIdKeyName)}`, localStorage.getItem(localTokenKeyName))
      .then((userData: {validToken:boolean, data: { id: number; email: string; nombres: string; tipoDocumento: string; numeroDocumento: number; matriculaProfesional: string; direccionDomicilio: string; firmaConstructor: string; telefono: string; proyectosConstructor: any[]; qrConstructor: string; rol: string; } | null}) => {
        this.showSpinner = false;
        this.validToken = userData.validToken;
        this.userData = userData.data;
        if(!this.validToken){
          Swal.fire({
            title: 'La sesión finalizó',
            text: 'Favor iniciar sesión',
            timer: 5000,
            didClose: ()=>{
              this.router.navigateByUrl(login.path);
              this.dashBoardService.closeSession();
            }
          })
        }
      })
    }
    else{
      this.showSpinner = false;
      Swal.fire({
        title: 'La sesión finalizó',
        text: 'Favor iniciar sesión',
        timer: 5000,
        didClose: ()=>{
          this.router.navigateByUrl(login.path);
        }
      })
    }
  }

  closeSession(){
    this.dashBoardService.closeSession();
  }

}
