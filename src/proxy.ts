import { NextRequest, NextResponse } from "next/server";

const checkoutProductRedirects = new Map<string, string>([
  [
    "/products/matcha-shaker-bottle",
    "https://umimatchashop.com/shop/matcha-shaker-bottle",
  ],
  [
    "/products/bamboo-matcha-whisk",
    "https://umimatchashop.com/shop/bamboo-matcha-whisk",
  ],
  [
    "/products/haru-ceremonial-matcha",
    "https://umimatchashop.com/shop/haru-ceremonial-matcha",
  ],
  [
    "/products/okumidori-ceremonial-matcha",
    "https://umimatchashop.com/shop/okumidori-ceremonial-matcha",
  ],
  [
    "/products/matcha-whisk-holder",
    "https://umimatchashop.com/shop/matcha-whisk-holder",
  ],
  [
    "/products/matcha-starter-kit",
    "https://umimatchashop.com/shop/matcha-starter-kit",
  ],
  [
    "/products/matcha-bowl-chawan",
    "https://umimatchashop.com/shop/matcha-bowl-chawan",
  ],
  [
    "/products/premium-matcha-tea-set",
    "https://umimatchashop.com/shop/premium-matcha-tea-set",
  ],
  [
    "/products/bamboo-matcha-scoop",
    "https://umimatchashop.com/shop/bamboo-matcha-scoop",
  ],
  [
    "/products/matcha-duo-bundle",
    "https://umimatchashop.com/shop/matcha-duo-bundle",
  ],
  [
    "/products/instant-matcha-latte-mix",
    "https://umimatchashop.com/shop/instant-matcha-latte-mix",
  ],
  [
    "/products/matcha-whisk-set",
    "https://umimatchashop.com/shop/matcha-whisk-set",
  ],
  [
    "/products/matcha-scoop-set",
    "https://umimatchashop.com/shop/matcha-scoop-set",
  ],
]);

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname !== "checkout.umimatchashop.com") {
    return NextResponse.next();
  }

  const destination = checkoutProductRedirects.get(request.nextUrl.pathname);
  if (!destination) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(destination);
  redirectUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/products/:path*"],
};
