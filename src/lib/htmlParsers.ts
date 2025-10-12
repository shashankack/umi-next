/**
 * HTML Parser Utilities for Shopify Product Descriptions
 * Extracts structured data from product descriptionHtml
 */

export interface ParsedProductData {
  pageTitle: string | null;
  pageDescription: string | null;
  pageKeywords: string | null;
  tagline: string | null;
  summary: string | null;
  fullDescription: string | null;
  paragraphs: string[];
  attributes: string[];
  highlightedAttributes: string[];
  productProfile: {
    left: string[];
    right: string[];
  };
  tastingNotes: {
    left: string[];
    right: string[];
  };
}

/**
 * Parse product description HTML and extract all structured data
 */
export function parseProductDescription(descriptionHtml: string): ParsedProductData {
  if (typeof window === 'undefined') {
    // Server-side parsing (Next.js SSR)
    return parseProductDescriptionServer(descriptionHtml);
  }
  
  // Client-side parsing
  return parseProductDescriptionClient(descriptionHtml);
}

/**
 * Client-side HTML parsing using DOMParser
 */
function parseProductDescriptionClient(descriptionHtml: string): ParsedProductData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(descriptionHtml, "text/html");

  return {
    pageTitle: extractTextContent(doc, "p.page-title"),
    pageDescription: extractTextContent(doc, "p.page-description"),
    pageKeywords: extractTextContent(doc, "p.page-keywords"),
    tagline: extractInnerHTML(doc, "p.tagline"),
    summary: extractInnerHTML(doc, "p.summary"),
    fullDescription: extractTextContent(doc, "p.full-description"),
    paragraphs: extractMultipleInnerHTML(doc, "p.description"),
    attributes: extractMultipleTextContent(doc, "ul.attributes li"),
    highlightedAttributes: extractMultipleTextContent(doc, "ul.highlighted-attributes li"),
    productProfile: extractTableData(doc, "table.product-profile tr"),
    tastingNotes: extractTableData(doc, "table.tasting-notes tr"),
  };
}

/**
 * Server-side HTML parsing using regex and basic string manipulation
 * (Fallback for SSR environments without DOM APIs)
 */
function parseProductDescriptionServer(descriptionHtml: string): ParsedProductData {
  return {
    pageTitle: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*page-title[^"]*"[^>]*>(.*?)<\/p>/s),
    pageDescription: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*page-description[^"]*"[^>]*>(.*?)<\/p>/s),
    pageKeywords: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*page-keywords[^"]*"[^>]*>(.*?)<\/p>/s),
    tagline: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*tagline[^"]*"[^>]*>(.*?)<\/p>/s),
    summary: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*summary[^"]*"[^>]*>(.*?)<\/p>/s),
    fullDescription: extractWithRegex(descriptionHtml, /<p[^>]*class="[^"]*full-description[^"]*"[^>]*>(.*?)<\/p>/s),
    paragraphs: extractMultipleWithRegex(descriptionHtml, /<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/p>/gs),
    attributes: extractListItems(descriptionHtml, "attributes"),
    highlightedAttributes: extractListItems(descriptionHtml, "highlighted-attributes"),
    productProfile: extractTableDataServer(descriptionHtml, "product-profile"),
    tastingNotes: extractTableDataServer(descriptionHtml, "tasting-notes"),
  };
}

// ========== CLIENT-SIDE HELPER FUNCTIONS ==========

function extractTextContent(doc: Document, selector: string): string | null {
  const element = doc.querySelector(selector);
  return element ? element.textContent?.trim() || null : null;
}

function extractInnerHTML(doc: Document, selector: string): string | null {
  const element = doc.querySelector(selector);
  return element ? element.innerHTML.trim() : null;
}

function extractMultipleTextContent(doc: Document, selector: string): string[] {
  const elements = doc.querySelectorAll(selector);
  return Array.from(elements).map((el) => el.textContent?.trim() || "");
}

function extractMultipleInnerHTML(doc: Document, selector: string): string[] {
  const elements = doc.querySelectorAll(selector);
  return Array.from(elements).map((el) => el.innerHTML.trim());
}

function extractTableData(doc: Document, selector: string): { left: string[]; right: string[] } {
  const rows = doc.querySelectorAll(selector);
  const left: string[] = [];
  const right: string[] = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 2) {
      left.push(cells[0].textContent?.trim() || "");
      right.push(cells[1].textContent?.trim() || "");
    }
  });

  return { left, right };
}

// ========== SERVER-SIDE HELPER FUNCTIONS ==========

function extractWithRegex(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  if (!match || !match[1]) return null;
  
  // Strip HTML tags and clean up
  return match[1].replace(/<[^>]*>/g, "").trim() || null;
}

function extractMultipleWithRegex(html: string, regex: RegExp): string[] {
  const matches = Array.from(html.matchAll(regex));
  return matches.map((match) => match[1]?.trim() || "").filter(Boolean);
}

function extractListItems(html: string, className: string): string[] {
  const regex = new RegExp(
    `<ul[^>]*class="[^"]*${className}[^"]*"[^>]*>(.*?)<\\/ul>`,
    's'
  );
  const match = html.match(regex);
  if (!match || !match[1]) return [];

  const itemRegex = /<li[^>]*>(.*?)<\/li>/gs;
  const items = Array.from(match[1].matchAll(itemRegex));
  return items.map((item) => item[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);
}

function extractTableDataServer(html: string, className: string): { left: string[]; right: string[] } {
  const tableRegex = new RegExp(
    `<table[^>]*class="[^"]*${className}[^"]*"[^>]*>(.*?)<\\/table>`,
    's'
  );
  const tableMatch = html.match(tableRegex);
  if (!tableMatch || !tableMatch[1]) return { left: [], right: [] };

  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
  const rows = Array.from(tableMatch[1].matchAll(rowRegex));

  const left: string[] = [];
  const right: string[] = [];

  rows.forEach((row) => {
    const cellRegex = /<td[^>]*>(.*?)<\/td>/gs;
    const cells = Array.from(row[1].matchAll(cellRegex));
    
    if (cells.length === 2) {
      left.push(cells[0][1].replace(/<[^>]*>/g, "").trim());
      right.push(cells[1][1].replace(/<[^>]*>/g, "").trim());
    }
  });

  return { left, right };
}

// ========== INDIVIDUAL PARSER FUNCTIONS (For specific use cases) ==========

/**
 * Extract page title for SEO
 */
export function extractPageTitle(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.pageTitle;
}

/**
 * Extract page description for SEO
 */
export function extractPageDescription(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.pageDescription;
}

/**
 * Extract page keywords for SEO
 */
export function extractPageKeywords(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.pageKeywords;
}

/**
 * Extract tagline
 */
export function extractTagline(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.tagline;
}

/**
 * Extract summary
 */
export function extractSummary(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.summary;
}

/**
 * Extract full description
 */
export function extractFullDescription(descriptionHtml: string): string | null {
  const parsed = parseProductDescription(descriptionHtml);
  return parsed.fullDescription;
}
