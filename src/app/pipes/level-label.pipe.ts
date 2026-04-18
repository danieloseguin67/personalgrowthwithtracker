import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'levelLabel', standalone: true })
export class LevelLabelPipe implements PipeTransform {
  transform(levels: { value: number; label: string }[], selected: number): string {
    return levels.find(l => l.value === selected)?.label ?? '';
  }
}
