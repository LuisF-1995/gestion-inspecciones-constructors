import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { gestionInspeccionesUrl } from '../../../constants/Api';
import { dashboard, register } from '../../../constants/Routes';
import { ValidateDataService } from '../../services/form-validation/validate-data.service';
import { LoginService } from '../../services/login/login.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { localTokenKeyName, localUserIdKeyName } from '../../../constants/GlobalData';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'page-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private validateDataService: ValidateDataService, private authService: LoginService, private router: Router, private dashBoardService:DashboardService) {
  }

  ngOnInit(): void {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(localTokenKeyName) && localStorage.getItem(localUserIdKeyName)){
      this.router.navigateByUrl(dashboard.path);
    }
  }

  apiUrl:string = gestionInspeccionesUrl;
  registerUrl:string = register.path;
  dashboardUrl:string = dashboard.path;
  loginData = {
    email:"",
    password:""
  }
  isValidMail:boolean = false;
  errorMessage:string = "";
  showSpinner:boolean = false;
  spinnerMessage:string = '';
  hidePassword:boolean = true;


  async login(){
    this.showSpinner = true;
    this.spinnerMessage = 'Validando email ...';
    const validEmail:boolean = this.validateDataService.validateEmail(this.loginData.email);

    if(this.loginData.email.length > 0 && validEmail && this.loginData.password.length > 0){
      this.spinnerMessage = 'Verificando credenciales ...';
      const loginResponse = await this.authService.login(this.apiUrl, "constructores/login", this.loginData);

      if (loginResponse.success) {
        this.router.navigateByUrl(this.dashboardUrl);
      }
      else {
        this.showSpinner = false;
        this.errorMessage = loginResponse.message ? loginResponse.message : '';
        Swal.fire({
          title: 'No se pudo iniciar sesión!',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'Ir a registrarme',
          showCancelButton:true,
          cancelButtonText: 'Cerrar'
        })
        .then(event => {
          if(event.isConfirmed){
            this.router.navigateByUrl(this.registerUrl);
          }
        })
      }
    }
    else{
      this.showSpinner = false;
      this.errorMessage = this.validateDataService.identifyMailErrors(this.loginData.email);
    }
  }
}
