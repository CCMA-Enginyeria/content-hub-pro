export interface Tipology {
  idName: string;
  localName: string;
  defaultDomainIdName?: string;
  type: 'tipology';
}

export interface ContentDomain {
  idName: string;
  localName: string;
  type: 'domain';
  subDomains?: ContentDomain[];
  tipologies?: Tipology[];
}

export interface ContentTree {
  items: ContentDomain[];
}
