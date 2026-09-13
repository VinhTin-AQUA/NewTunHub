import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { IconMemes } from './features/icon-memes/icon-memes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'icon-memes', component: IconMemes },
];
