import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  constructor(@Inject(Router) private router: Router){}
  
  ngOnInit(): void {
   setTimeout(()=>{
    this.router.navigateByUrl('/home');
   }, 3000);
  }

}
