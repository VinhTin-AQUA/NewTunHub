import { Component } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [RouterLink, CommonModule],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    menus: MenuItem[] = [
        {
            id: 1,
            title: 'Icon Memes',
            description: '',
            icon: '😀',
            route: '/icon-memes',
            color: 'from-blue-500 to-blue-700',
        }
    ];
}
