export function numberToWords(amount: number): string {
  if (amount === 0) return 'Zero';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
    'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertWholeNumber = (num: number): string => {
    if ((num = num.toString().replace(/[\, ]/g, '') as any) != parseFloat(num as any)) return 'not a number';
    let x = num.toString().indexOf('.');
    if (x == -1) x = num.toString().length;
    if (x > 15) return 'too big';
    const n = num.toString().split('');
    let str = '';
    let sk = 0;
    for (let i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += a[Number(n[i] + n[i + 1])] + ' ';
          i++;
          sk = 1;
        } else if (n[i] != '0') {
          str += b[Number(n[i])] + ' ';
          sk = 1;
        }
      } else if (n[i] != '0') {
        str += a[Number(n[i])] + ' ';
        if ((x - i) % 3 == 0) str += 'Hundred ';
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk) str += (['', 'Thousand', 'Million', 'Billion', 'Trillion'])[Math.floor((x - i - 1) / 3)] + ' ';
        sk = 0;
      }
    }
    return str.trim();
  };

  const strAmount = amount.toFixed(2);
  const parts = strAmount.split('.');
  const wholePart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);

  let result = convertWholeNumber(wholePart);
  
  if (decimalPart > 0) {
    result += ` and ${decimalPart}/100`;
  }
  
  return result;
}
