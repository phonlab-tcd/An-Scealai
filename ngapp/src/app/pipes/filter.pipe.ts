import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../user';
import { Story } from '../story';

/*
* Pipe created to filter out usernames from the list of users in the find-user component
*/
@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: PipeInput[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    // used in admin find-user component and student book-contents component
    // it.username for admin, it.title for student
    return items.filter(it => {
      if (it instanceof User)
        return it.username.toLocaleLowerCase().includes(searchText);
      if (it instanceof Story)
        return it.title.toLocaleLowerCase().includes(searchText) || it.text.toLocaleLowerCase().includes(searchText);
    });
  }
}

type PipeInput = User | Story;
