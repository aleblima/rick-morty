import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  // Pegamos as referências dos elementos HTML para o GSAP controlar
  @ViewChild('headerRef') header!: ElementRef;
  @ViewChild('logoRef') logo!: ElementRef;
  @ViewChild('menuTextRef') navTexts!: ElementRef; // Você precisará por uma classe ou ref nos textos
  @ViewChild('badgeRef') badgeRef!: ElementRef;

  private timeline: gsap.core.Timeline | null = null;
  private isCollapsed = false;

  ngAfterViewInit() {
    // Cria a linha do tempo PAUSADA. Só vamos tocar ela quando rolar.
    this.timeline = gsap.timeline({
      paused: true,
      defaults: { duration: 0.4, ease: 'power2.inOut' },
    });

    onReverseComplete: () => {
      gsap.set('.icon, .text, .navbar, .logo, .badge, .menu', {
        clearProps: 'all',
      });
    };
    // Definimos o que acontece na animação (O "Roteiro" da mudança)
    this.timeline
      .to(
        '.logo',
        {
          left: '50%',
          xPercent: -50, // Isso garante o centro exato
          scale: 1.4,
          position: 'absolute',
          duration: 0.7,
        },
        0,
      )
      .to(
        '.text',
        {
          // Classe que você vai por no "Início" e "Favoritos"
          width: 0,
          opacity: 0,
          display: 'none', // GSAP sabe lidar com display none no final da animação
          duration: 0.5,
        },
        0,
      )
      .to(
        '.btn',
        {
          backgroundColor: '#888',
          border: '1px solid #000',
          borderRadius: '48px', // Arredonda
          padding: '4px 12px', // Dá um respiro interno
          marginRight: '8px', // Garante que não cole na borda da tela
          duration: 0.3,
        },
        0,
      )
      .to(
        '.navbar',
        {
          height: '60px',
          duration: 0.4,
          backgroundColor: 'transparent',
        },
        0,
      )
      .to(
        '.menu',
        {
          border: 'none',
          duration: 0.01,
        },
        0,
      )
      .to(this.badgeRef.nativeElement, {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: 'bold',
        position: 'absolute',
        top: '8px',
        right: '11px',
        width: 'auto',
        height: 'auto',
        padding: 0,
        margin: 0,
        duration: 0.3,
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;

    // Se desceu mais que 50px e ainda não colapsou
    if (scrollY > 50 && !this.isCollapsed) {
      this.timeline?.play(); // Toca a animação de ida
      this.isCollapsed = true;
    }
    // Se voltou pro topo e está colapsado
    else if (scrollY <= 50 && this.isCollapsed) {
      this.timeline?.reverse(); // Toca a animação de volta (rewind)
      this.isCollapsed = false;
    }
  }
}
