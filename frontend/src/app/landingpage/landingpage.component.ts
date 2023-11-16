import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent {

// Inject the Router in the constructor
constructor(private router: Router) {}

// Use navigate method to navigate programmatically
goToLogin() {
  this.router.navigate(['/login']);
}

  }

