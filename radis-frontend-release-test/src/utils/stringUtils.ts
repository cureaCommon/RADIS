export function normalizeTurkish(str: string): string {
    return str
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .replace(/Ş/g, 'ş')
        .replace(/Ğ/g, 'ğ')
        .replace(/Ü/g, 'ü')
        .replace(/Ö/g, 'ö')
        .replace(/Ç/g, 'ç')
        .toLowerCase();
}
