import { Pipe, PipeTransform } from '@angular/core';

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
  transform(items: any[], searchText: string): any[] {
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
      if(it.username)
        return it.username.toLocaleLowerCase().includes(searchText);
      return it.title.toLocaleLowerCase().includes(searchText) || it.text.toLocaleLowerCase().includes(searchText);
    });
  }
}