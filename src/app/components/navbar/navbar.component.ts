import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavBarService } from './navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnChanges{
  constructor(
    private navbarService: NavBarService,
    private router: Router
  ){ }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  searchKey:string = "";

  search() {
    console.log("search() called searchKey: ", this.searchKey);
    
    if (this.searchKey) {
      this.router.navigate(['/search', this.searchKey]);
    }
  }



  useLocalDB(){
    let btn = document.getElementById("localdb");
    let iTag = btn?.querySelector('i');
    if(iTag){
      if(iTag.classList.contains('bi-sun')){
        iTag.className = '';
        iTag.classList.add('bi', 'bi-sun-fill');
        this.navbarService.updateDbState(true);
      }else{
        iTag.className = '';
        iTag.classList.add('bi', 'bi-sun');
        this.navbarService.updateDbState(false);
      }
    }
  }
}
