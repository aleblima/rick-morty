import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RickMortyService } from '../services/rick-morty.service';
import { iChar } from '../models/char.model';
import { CardComponent } from '../card/card.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  characters: iChar[] = [];
  currentPage: number = 1;

  constructor(
    private service: RickMortyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(500), // Espera 500ms o usuário parar de digitar
        distinctUntilChanged(), // Só busca se o texto mudou mesmo
      )
      .subscribe((text) => {
        this.searchTerm = text;
        this.currentPage = 1; // Volta pra página 1 ao pesquisar
        this.loadCharacter();
      });
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.loadCharacter();
    });
  }

  changePage(step: number) {
    const nextPage = this.currentPage + step;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nextPage },
      queryParamsHandling: 'merge',
    });
  }

  loadCharacter() {
    this.service.getCharacters(this.currentPage, this.searchTerm).subscribe({
      next: (data) => {
        this.characters = data.results;
        console.log('Dados carregados: ', this.characters);
        window.scrollTo(0, 0);
      },
      error: (erro) => {
        console.error('Erro ao procurar dados: ', erro);
        this.characters = [];
      },
    });
  }
}
