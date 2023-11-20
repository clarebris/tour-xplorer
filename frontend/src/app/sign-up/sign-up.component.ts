import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  registrationForm!: FormGroup
constructor(private fb:FormBuilder, private authService: AuthService){
  this.registrationForm = this.fb.group({
    fullName: ['',[Validators.required]],
    email: ['',[Validators.required]],
    phone_number: ['',[Validators.required]],
    password: ['',[Validators.required]],
    confirm_password: ['',[Validators.required]],
  });


}
createUser(){
  // console.log(this.registrationForm.value);
  let user_details: User = this.registrationForm.value;
this.authService.registerUser(user_details)

}
}


