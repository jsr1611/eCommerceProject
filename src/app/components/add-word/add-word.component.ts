import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Category, Word } from 'src/app/models/word';
import { CategoryMapping } from 'src/app/mappings/category-mapping';
import { DictionaryService } from 'src/app/services/DictionaryService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.css']
})
export class AddWordComponent {
  public newWord: Word = {
    arabic: '',
    pronunciation: '',
    uzbek: '',
    english: '',
    category: Category.Noun,
  };

  categories: Category[] = Object.values(Category); // Enum values
  categoryLabels = CategoryMapping; // Uzbek labels
  successMsg = "";

  constructor(
    private dictionaryService: DictionaryService,
  ) {}

  addWord(): void {
    // Validate required fields
    if (!this.isFormValid()) {
      console.log('Please fill out all required fields for a new word');
      return;
    }

    this.dictionaryService.createDictEntry(this.newWord).pipe(
      catchError((error) => {
        console.error('Error creating word entry:', error.error);
        this.successMsg = "So'zni saqlashda muammoga duch kelindi.";
        let errMsg = error.error ? error.error.message : error.message;
        alert(errMsg);
        return of(null);
      })
    ).subscribe((data) => {
      if (data) {
        console.log('Server response:', data);
        this.resetForm();
        this.successMsg = "So'z muvaffaqiyatli saqlandi...";
        setTimeout(() => {
          window.location.reload();  
        }, 2000)

      }
    });
  }

  private isFormValid(): boolean {
    return !!(this.newWord.arabic && this.newWord.uzbek && this.newWord.category && this.newWord.pronunciation);
  }

  private resetForm(): void {
    this.newWord = {
      arabic: '',
      pronunciation: '',
      uzbek: '',
      english: '',
      category: Category.Noun,
    };
  }
}
