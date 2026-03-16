import rawData from './arbreContinguts.json';
import { ContentDomain, ContentTree } from '@/types/contentTree';

const data = rawData as ContentTree;

/** Top-level domains (direct children of items[]) */
export const topLevelDomains: ContentDomain[] = data.items;

/** Get a flat lookup map by idName */
const domainMap = new Map<string, ContentDomain>();

function indexDomains(domains: ContentDomain[]) {
  for (const d of domains) {
    domainMap.set(d.idName, d);
    if (d.subDomains) indexDomains(d.subDomains);
  }
}
indexDomains(data.items);

export function getDomainByIdName(idName: string): ContentDomain | undefined {
  return domainMap.get(idName);
}
