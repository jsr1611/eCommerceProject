import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Category, Word } from 'src/app/models/word';
import { CategoryMapping } from 'src/app/mappings/category-mapping';
import { DictionaryService } from 'src/app/services/DictionaryService';

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

  constructor(private dictionaryService: DictionaryService) {}

  addWord(): void {
    // Validate required fields
    if (!this.isFormValid()) {
      console.log('Please fill out all required fields for a new word');
      return;
    }

    this.dictionaryService.createDictEntry(this.newWord).pipe(
      catchError((error) => {
        console.error('Error creating word entry:', error);
        return of(null);
      })
    ).subscribe((data) => {
      if (data) {
        console.log('Server response:', data);
        this.resetForm();
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
