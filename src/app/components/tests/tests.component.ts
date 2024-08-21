import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, catchError, of } from "rxjs";
import { DictionaryService } from "src/app/services/DictionaryService";
import { NavBarService } from "../navbar/navbar.service";
import { Word } from "src/app/models/word";

@Component({
  selector: "app-tests",
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.css"],
})
export class TestsComponent implements OnInit {
  constructor(
    private dictService: DictionaryService,
    private router: Router,
    private navbarService: NavBarService
  ) { }
  dict: Word[] = [];
  testNumber: number = 0;
  test: any = "";
  answers: any = [];
  tmpAnswerNumbers: number[] = [];
  correctAnswer: number = 2;
  totalTestNumbers: number[] = [];
  prevAnsKey: number = 0;
  userAnsers: boolean[] = [];
  userCorrectTimes: number = 0;
  userFalseTimes: number = 0;
  bestResult: number = 0;

  UZ_AR: boolean = false;


  localDbState: boolean = false;
  private _dbStateSub: Subscription = new Subscription();

  async ngOnInit(): Promise<void> {

    let previousBestResult = localStorage.getItem("bestResult");
    if (previousBestResult && Number(previousBestResult) > this.bestResult) {
      this.bestResult = Number(previousBestResult);
    }
    try {
      (await this.dictService
        .getDictionary())
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
        )
        .subscribe((data) => {
          this.dict = data ?? [];
          this.generateTest();
        });
    } catch (e) {
      console.log("Couldn't fetch data from cloud DB, falling back to local db data");

      (await this.dictService
        .getDictionaryLocal())
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
        )
        .subscribe((data) => {
          this.dict = data ?? [];
          this.generateTest();
        });
    }

    this._dbStateSub = this.navbarService.dbState.subscribe(
      async (newState: boolean) => {
        this.localDbState = newState;
        if (newState) {
          (await this.dictService.getDictionaryLocal())
            .pipe(
              catchError((error) => {
                console.log(error);
                return of(null);
              })
            )
            .subscribe((data) => {
              this.dict = data ?? [];
              this.generateTest();
            });
        }
      }
    );
  }

  stopTest() {
    this.announceResults();
    this.generateTest();
  }

  changeUzbArab() {
    this.UZ_AR = !this.UZ_AR;
  }

  generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  announceResults() {
    if (this.bestResult < this.userCorrectTimes) {
      this.bestResult = this.userCorrectTimes;
      localStorage.setItem('bestResult', this.bestResult.toString());
    }
    alert(
      "Siz " +
      this.totalTestNumbers.length +
      " ta testdan " +
      this.userCorrectTimes +
      " tasini to'g'ri yechdingiz. Yana urinib ko'ring!"
    );
    this.totalTestNumbers = [];
    this.userAnsers = [];
    this.userCorrectTimes = 0;
    this.userFalseTimes = 0;
  }

  generateTest() {
    let btns = document.getElementsByClassName("ans-btn");
    for (let index = 0; index < btns.length; index++) {
      const btn = btns[index];
      btn.className = "";
      btn.classList.add("ans-btn", "btn", "btn-light");
    }

    this.answers = [];
    this.testNumber = this.generateRandomNumber(this.dict.length);
    if (this.totalTestNumbers.length > 0) {
      if (this.totalTestNumbers.length === this.dict.length) {
        this.announceResults();
      }
      while (this.totalTestNumbers.includes(this.testNumber)) {
        this.testNumber = this.generateRandomNumber(this.dict.length);
      }
    }
    this.totalTestNumbers.push(this.testNumber);
    this.test = this.dict[this.testNumber];

    this.tmpAnswerNumbers = [];
    let randNumber = 0;
    this.correctAnswer = this.generateRandomNumber(4);

    this.tmpAnswerNumbers.push(this.testNumber);
    for (let i = 0; i < 4; i++) {
      if (i === this.correctAnswer) {
        this.answers.push(this.dict[this.testNumber]);
      } else {
        randNumber = this.generateRandomNumber(this.dict.length);
        while (this.tmpAnswerNumbers.includes(randNumber)) {
          randNumber = this.generateRandomNumber(this.dict.length);
        }
        this.answers.push(this.dict[randNumber]);
        this.tmpAnswerNumbers.push(randNumber);
      }
    }
  }

  submitAnswer(key: number) {
    let btn = document.getElementById("ans" + key);
    btn?.classList.remove("btn-light");
    this.prevAnsKey = key;
    if (key === this.correctAnswer) {
      btn?.classList.add("btn-success");
      if (this.totalTestNumbers.length > this.userAnsers.length) {
        this.userAnsers.push(true);
        this.userCorrectTimes += 1;
      }
    } else {
      btn?.classList.add("btn-danger");
      if (this.totalTestNumbers.length > this.userAnsers.length) {
        this.userAnsers.push(false);
        this.userFalseTimes += 1;
      }
    }
  }
}
