import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Word } from 'src/app/models/word';
import { DictionaryService } from 'src/app/services/DictionaryService';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

  constructor(
    private dictService: DictionaryService,
    private route: ActivatedRoute
  ) { }
  fileExists: boolean = false;
  word: any = "";
  searchKey: string = "";
  private localDict: Word[] = [];

  async ngOnInit(): Promise<void> {
    if (this.localDict.length === 0) {
      console.log("initializing localDictionary...");

      try {
        // Ensure the local dictionary is fully loaded before doing anything else
        const dictionaryData = await this.dictService.getDictionary();

        dictionaryData.pipe(
          catchError(error => {
            console.log("Error loading local dictionary file: ", error);
            return of(null);
          })
        )
          .subscribe((data) => {
            if (data) {
              this.localDict = data;
              console.log("Dict: ", this.localDict);
            }
          });
      } catch (error) {
        console.error("Error in getting dictionary observable: ", error);
      }
    } else {
      console.log("localDict is already available, dict size: ", this.localDict.length);
    }

    // Now subscribe to route changes and perform the search
    this.route.params.subscribe(params => {
      this.searchKey = params['searchKey'];
      this.performSearch(this.searchKey);
    });
  }

  performSearch(searchKey: string) {
    console.log("search key:", searchKey, this.localDict.length);
    // Perform search only if the dictionary is loaded
    if (this.localDict.length > 0) {
      let someWord = this.localDict.filter(item => (item.uzbek.startsWith(searchKey) && item.uzbek.length ===searchKey.length) );
      this.word = someWord.length > 0 ? someWord[0] : null;
      console.log("word: ", this.word);
    } else {
      console.log("Local dictionary not loaded, cannot perform search.");
    }
  }
}
