import fs from 'node:fs';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';

export type MockupStatus = 'approved' | 'review' | 'draft';

export interface MockupFrame {
  slug: string;
  title: string;
  statusLabel: string;
  status: MockupStatus;
  date: string | null;
  section: string;
  description: string;
  route: string;
  file: string;
  desktop: {src: string; width: number; height: number} | null;
  phone: {src: string; width: number; height: number} | null;
}

export interface MockupProduct {
  id: string;
  label: string;
  galleryDoc: string;
  frames: MockupFrame[];
}

export interface MockupsCatalog {
  products: MockupProduct[];
}

interface ProductSource {
  id: string;
  label: string;
  galleryFile: string;
  galleryDoc: string;
}

const PRODUCTS: ProductSource[] = [
  {id: 'truck', label: 'Truck', galleryFile: 'docs/truck/produto/mockups.mdx', galleryDoc: '/docs/truck/produto/mockups'},
  {id: 'shop', label: 'Shop', galleryFile: 'docs/shop/produto/mockups.mdx', galleryDoc: '/docs/shop/produto/mockups'},
  {id: 'chef', label: 'Chef', galleryFile: 'docs/confeitaria/produto/mockups.mdx', galleryDoc: '/docs/confeitaria/produto/mockups'},
  {id: 'techcare', label: 'TechCare', galleryFile: 'docs/techcare/produto/mockups.mdx', galleryDoc: '/docs/techcare/produto/mockups'},
];

const UNLISTED_SECTION = 'Fora da galeria';

interface GalleryEntry {
  title: string;
  section: string;
  description: string;
  order: number;
}

function classifyStatus(label: string): MockupStatus {
  const lower = label.toLowerCase();
  if (lower.includes('aprovad')) return 'approved';
  if (lower.includes('rascunho') || lower.includes('estudo') || lower.includes('proposta')) return 'draft';
  return 'review';
}

function isoDate(label: string): string | null {
  const match = /(\d{2})\/(\d{2})\/(\d{4})/.exec(label);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function pngSize(file: string): {width: number; height: number} | null {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  try {
    fs.readSync(fd, header, 0, 24, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (header.toString('ascii', 12, 16) !== 'IHDR') return null;
  return {width: header.readUInt32BE(16), height: header.readUInt32BE(20)};
}

function image(siteDir: string, publicPath: string) {
  const file = path.join(siteDir, 'static', publicPath);
  if (!fs.existsSync(file)) return null;
  const size = pngSize(file);
  return size ? {src: publicPath, ...size} : null;
}

function readProp(source: string, prop: string): string | null {
  return new RegExp(`${prop}="([^"]*)"`).exec(source)?.[1] ?? null;
}

function resolveDocLink(href: string, galleryDoc: string): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('/') || href.startsWith('#')) return href;
  const base = galleryDoc.slice(0, galleryDoc.lastIndexOf('/') + 1);
  return new URL(href.replace(/\.mdx?(?=#|$)/, ''), `https://x${base}`).pathname;
}

function parseGallery(source: string, galleryDoc: string): Map<string, GalleryEntry> {
  const entries = new Map<string, GalleryEntry>();
  const blocks: {level: number; title: string; lines: string[]}[] = [];

  for (const line of source.split('\n')) {
    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({level: heading[1].length, title: heading[2].trim(), lines: []});
    } else if (blocks.length > 0) {
      blocks[blocks.length - 1].lines.push(line);
    }
  }

  let section = 'Mockups';
  for (const block of blocks) {
    const body = block.lines.join('\n');
    const routes = [...body.matchAll(/\]\((\/telas\/[^)#\s]+)/g)].map((m) => m[1]);
    if (routes.length === 0) {
      if (block.level === 2) section = block.title;
      continue;
    }
    const description = body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('<img') && !/^\[Ver o mockup[^\]]*\]\([^)]*\)$/.test(p))
      .join('\n\n')
      .replace(/\]\(([^)\s]+)\)/g, (_, href: string) => `](${resolveDocLink(href, galleryDoc)})`);
    for (const route of routes) {
      if (!entries.has(route)) {
        entries.set(route, {title: block.title, section, description, order: entries.size});
      }
    }
  }
  return entries;
}

function loadProduct(siteDir: string, product: ProductSource): MockupProduct {
  const galleryPath = path.join(siteDir, product.galleryFile);
  const gallery = fs.existsSync(galleryPath)
    ? parseGallery(fs.readFileSync(galleryPath, 'utf8'), product.galleryDoc)
    : new Map<string, GalleryEntry>();

  const pagesDir = path.join(siteDir, 'src/pages/telas', product.id);
  const pageFiles = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).filter((f) => f.endsWith('.tsx')) : [];

  const frames = pageFiles.flatMap((pageFile): (MockupFrame & {order: number})[] => {
    const source = fs.readFileSync(path.join(pagesDir, pageFile), 'utf8');
    const file = readProp(source, 'file');
    if (!file) return [];
    const slug = pageFile.replace(/\.tsx$/, '');
    const route = `/telas/${product.id}/${slug}`;
    const statusLabel = readProp(source, 'status') ?? '';
    const entry = gallery.get(route);
    const folder = file.replace(/\/[^/]*$/, '');
    return [
      {
        slug,
        title: readProp(source, 'title') ?? entry?.title ?? slug,
        statusLabel,
        status: classifyStatus(statusLabel),
        date: isoDate(statusLabel),
        section: entry?.section ?? UNLISTED_SECTION,
        description: entry?.description ?? '',
        route,
        file,
        desktop: image(siteDir, `${folder}/desktop.png`),
        phone: image(siteDir, `${folder}/phone.png`),
        order: entry?.order ?? Number.MAX_SAFE_INTEGER,
      },
    ];
  });

  frames.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pt-BR'));

  return {
    id: product.id,
    label: product.label,
    galleryDoc: product.galleryDoc,
    frames: frames.map(({order: _order, ...frame}) => frame),
  };
}

export default function mockupsCatalogPlugin(context: LoadContext): Plugin<MockupsCatalog> {
  return {
    name: 'mockups-catalog',
    getPathsToWatch() {
      return [
        ...PRODUCTS.map((p) => path.join(context.siteDir, p.galleryFile)),
        path.join(context.siteDir, 'src/pages/telas/**/*.tsx'),
        path.join(context.siteDir, 'static/mockups/**/*.png'),
      ];
    },
    async loadContent() {
      return {products: PRODUCTS.map((p) => loadProduct(context.siteDir, p))};
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
}
