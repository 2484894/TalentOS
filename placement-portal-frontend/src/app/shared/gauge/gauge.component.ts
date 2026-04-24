import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html'
})
export class GaugeComponent {
  @Input() value: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showLabel: boolean = false;

  get color(): string {
    if (this.value >= 90) return 'var(--success)';
    if (this.value >= 75) return 'var(--primary)';
    if (this.value >= 60) return 'var(--warning)';
    return 'var(--ink-3)';
  }

  get label(): string {
    if (this.value >= 90) return 'Excellent fit';
    if (this.value >= 75) return 'Strong fit';
    if (this.value >= 60) return 'Good fit';
    return 'Fair fit';
  }

  get dimensions() {
    if (this.size === 'sm') return { box: 44, radius: 17, stroke: 3.5, font: '13px' };
    if (this.size === 'lg') return { box: 80, radius: 32, stroke: 5,   font: '22px' };
    return { box: 60, radius: 24, stroke: 4, font: '16px' };
  }

  get circumference(): number {
    return 2 * Math.PI * this.dimensions.radius;
  }

  get offset(): number {
    return this.circumference - (this.value / 100) * this.circumference;
  }
}
