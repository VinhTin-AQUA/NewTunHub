import { Component, computed, signal } from '@angular/core';
import { rawIconString } from './icons';

interface StickerItem {
    name: string;
    url: string;
}

@Component({
    selector: 'app-icon-memes',
    imports: [],
    templateUrl: './icon-memes.html',
    styleUrl: './icon-memes.css',
})
export class IconMemes {
    rawData = rawIconString;

    // Parse thành danh sách {name, url}
    readonly stickers = computed<StickerItem[]>(() => {
        const lines = this.rawData
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const items: StickerItem[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Nếu dòng là URL → ghép với tên phía trước
            if (/^https?:\/\//i.test(line)) {
                if (items.length > 0) {
                    items[items.length - 1].url = line;
                }
                continue;
            }

            // Ngược lại là tên → tạo item mới
            items.push({ name: line, url: '' });
        }

        return items.filter((it) => it.url);
    });

    // item vừa copy (để hiện feedback "Copied!")
    readonly copiedUrl = signal<string | null>(null);

    /** Lấy extension từ URL (gif, png, jpg, webp...), mặc định gif */
    private getExtension(url: string): string {
        const clean = url.split('?')[0].split('#')[0];
        const match = clean.match(/\.([a-z0-9]+)$/i);
        return match ? match[1].toLowerCase() : 'gif';
    }

    /** Tên file an toàn: bỏ ký tự đặc biệt, thêm đuôi */
    private buildFileName(item: StickerItem): string {
        const safeName = item.name
            .trim()
            .replace(/[\\/:*?"<>|]+/g, '') // bỏ ký tự không hợp lệ trên Windows
            .replace(/\s+/g, '_'); // space -> _
        return `${safeName}.${this.getExtension(item.url)}`;
    }

    /** Download: fetch blob rồi trigger <a download> */
    async download(item: StickerItem) {
        try {
            const res = await fetch(item.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = this.buildFileName(item);
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (e) {
            console.error('Download thất bại', e);
            // fallback: mở tab mới
            window.open(item.url, '_blank');
        }
    }
}
