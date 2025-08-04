import { content } from './../../../node_modules/micromark-core-commonmark/lib/content.d';
export type Kegiatan = {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  coverImage?: string;
  date: string;
};