import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CategoryMapping } from 'src/app/mappings/category-mapping';
import { Category, Word } from 'src/app/models/word';
import { DictionaryService } from 'src/app/services/DictionaryService';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.css']
})
export class AddWordComponent {
  dict:Word[] = [];

  public newWord: Word = {
    arabic: '',
    pronunciation: '',
    uzbek: '',
    english: '',
    category: Category.Noun,
  }
  categories: Category[] = Object.values(Category); // Enum values
  categoryLabels = CategoryMapping; // Uzbek labels

  constructor(private http: DictionaryService){}

  addWord(){
    console.log("New word: ", (this.newWord ?? " "));

    const newWord:Word = {
      pronunciation: this.newWord.pronunciation,
      arabic: this.newWord.arabic,
      uzbek: this.newWord.uzbek,
      english: this.newWord.english,
      category: this.newWord.category,
    }
    if(!newWord.arabic || !newWord.uzbek || !newWord.category || !newWord.pronunciation) {
      console.log("Please fill out all required fields for a new word");
      return;
    }
    else{
    this.http.createDictEntry(newWord).pipe(
        catchError((error) => {
          console.log(error);
          return of(null);
        })
    )
    .subscribe((data)=>{
      if(data){
        console.log("Server response: ", data);
        this.newWord.arabic = "";
        this.newWord.english = "";
        this.newWord.uzbek = "";
        this.newWord.category = Category.Noun;
        this.newWord.pronunciation = "";
      }
    });
  };
}
}
