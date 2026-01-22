import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iCharResponse } from '../models/char.model';

@Injectable({
  providedIn: 'root',
})
export class RickMortyService {
  private apiURL = 'https://rickandmortyapi.com/api/character';
  private favorites: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites = JSON.parse(saved);
      this.favoritesSubject.next(this.favorites);
    }
  }

  getCharacters(
    page: number = 1,
    name: string = '',
  ): Observable<iCharResponse> {
    return this.http.get<iCharResponse>(
      `${this.apiURL}/?page=${page}&name=${name}`,
    );
  }

  getFavorites() {
    return this.favorites;
  }

  toggleFavorite(character: any) {
    const index = this.favorites.findIndex((fav) => fav.id === character.id);

    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(character);
    }
    this.saveFavorites();
    this.favoritesSubject.next(this.favorites);
  }

  isFavorite(id: number): boolean {
    return this.favorites.some((fav) => fav.id === id);
  }

  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}
