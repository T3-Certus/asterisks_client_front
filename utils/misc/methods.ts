import cookie from "cookie"

export function capitalize(text: string): string{
  return text.substring(0,1).toUpperCase() + text.substring(1)
}

export function parseCookies(req: any){
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export function transformer(amount: number) {
  let amountString = amount.toString();
  return `S/. ${amountString.substring(0, amountString.length-2)}.${amountString.substring(amountString.length-2)}`
};

export function discounter(amount: number, discount: number) {
  let discountedPrice = amount * ((100-discount)/100)
  return discountedPrice;
};