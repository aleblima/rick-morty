import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RickMortyService } from '../services/rick-morty.service';
import { iChar } from '../models/char.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  characters: iChar[] = [];
  currentPage: number = 1;

  constructor(
    private service: RickMortyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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
    this.service.getCharacters(this.currentPage).subscribe({
      next: (data) => {
        this.characters = data.results;
        console.log('Dados carregados: ', this.characters);
        window.scrollTo(0, 0);
      },
      error: (erro) => {
        console.error('Erro ao procurar dados: ', erro);
      },
    });
  }
}
