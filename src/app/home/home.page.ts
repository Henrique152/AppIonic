import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { startWith, pairwise } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn :'root'
})


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  public generos = [
    'Masculino', 
    'Feminino', 
    'Não Informar', 
    'Outro'
  ]
  

  public formulario: FormGroup;

  constructor(private fb:FormBuilder) {
    this.formulario = fb.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      sobrenome:['',Validators.compose([Validators.required, Validators.minLength(3)])],
      genero: [''],
      cep:['', Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(8)])],
      cpf:['',Validators.compose([Validators.required, Validators.minLength(8), CpfValidator.cpfValido])]
    });

    this.formulario.get('genero')
    .valueChanges
    .pipe(startWith(null),pairwise())
    .subscribe(([ anterior, atual]: [any, any]) => {
      console.log(anterior, atual);
    })
  }
 

  ngOnInit() {
    let dado = {
      nome: "",
      genero: "",
      cpf:"",
      cep:""
    };
    //this.formulario.controls.nome.disable();

    this.formulario.patchValue(dado, {emitEvent: true});
  }

  enviar() {
    console.log(this.formulario.value);
    if (!this.formulario.valid) {
        this.formulario.markAllAsTouched();
    }
  }

}




export class CpfValidator {
  static cpfValido = (control: FormControl): any => {
    const cpfString = String(control.value).replace(/\D/g, '');
    let rev = 0;
    let add = 0;
    if (
      cpfString.length !== 11 ||
      cpfString === '00000000000' ||
      cpfString === '11111111111' ||
      cpfString === '22222222222' ||
      cpfString === '33333333333' ||
      cpfString === '44444444444' ||
      cpfString === '55555555555' ||
      cpfString === '66666666666' ||
      cpfString === '77777777777' ||
      cpfString === '88888888888' ||
      cpfString === '99999999999'
    ) {
      return {
        invalido: true,
      };
    }
    add = 0;
    for (let i = 1; i <= 9; i++) {
      add += Number(cpfString.substring(i - 1, i)) * (11 - i);
    }
    rev = (add * 10) % 11;
    if (rev === 10 || rev === 11) {
      rev = 0;
    }
    if (rev !== Number(cpfString.charAt(9))) {
      return {
        invalido: true,
      };
    }
    add = 0;
    for (let i = 1; i <= 10; i++) {
      add += Number(cpfString.substring(i - 1, i)) * (12 - i);
    }
    rev = (add * 10) % 11;
    if (rev === 10 || rev === 11) {
      rev = 0;
    }
    if (rev !== Number(cpfString.charAt(10))) {
      return {
        invalido: true,
      };
    }
    return null;
  };

}