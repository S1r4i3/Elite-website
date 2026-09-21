/**
 * Simplified federal refund / liability estimator — tax year 2025 figures
 * (standard deduction as amended by P.L. 119-21). For illustration only; it does not
 * cover itemized deductions, AMT, QBI, state taxes, phase-outs or most credits.
 */
export type EmploymentType = "w2" | "1099" | "self-employed" | "business-owner";
export type FilingStatus = "single" | "mfj" | "hoh" | "mfs";

export type EstimateInput = {
  employmentType: EmploymentType;
  income: number;
  withheld: number;
  filingStatus: FilingStatus;
  dependents: number;
  estimatedPayments?: number;
};

export type EstimateResult = {
  taxYear: number;
  type: "refund" | "owed";
  amount: number;
  totalTax: number;
  incomeTax: number;
  selfEmploymentTax: number;
  taxableIncome: number;
  standardDeduction: number;
  childTaxCredit: number;
  totalPayments: number;
  effectiveRate: number;
  marginalRate: number;
};

const TAX_YEAR = 2025;

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15750,
  mfs: 15750,
  mfj: 31500,
  hoh: 23625,
};

// [upper bound, rate]
const BRACKETS: Record<FilingStatus, [number, number][]> = {
  single: [[11925, 0.1], [48475, 0.12], [103350, 0.22], [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37]],
  mfs: [[11925, 0.1], [48475, 0.12], [103350, 0.22], [197300, 0.24], [250525, 0.32], [375800, 0.35], [Infinity, 0.37]],
  mfj: [[23850, 0.1], [96950, 0.12], [206700, 0.22], [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37]],
  hoh: [[17000, 0.1], [64850, 0.12], [103350, 0.22], [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37]],
};

const CTC_PER_CHILD = 2200;
const CTC_PHASEOUT_START: Record<FilingStatus, number> = { single: 200000, mfs: 200000, hoh: 200000, mfj: 400000 };
const SS_WAGE_BASE = 176100;

function bracketTax(taxable: number, status: FilingStatus) {
  let tax = 0;
  let lower = 0;
  let marginal = 0.1;
  for (const [upper, rate] of BRACKETS[status]) {
    if (taxable <= lower) break;
    const slice = Math.min(taxable, upper) - lower;
    tax += slice * rate;
    marginal = rate;
    lower = upper;
  }
  return { tax, marginal };
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const income = Math.max(0, input.income);
  const selfEmployed = input.employmentType !== "w2";

  let seTax = 0;
  let seDeduction = 0;
  if (selfEmployed) {
    const netEarnings = income * 0.9235;
    const ss = Math.min(netEarnings, SS_WAGE_BASE) * 0.124;
    const medicare = netEarnings * 0.029;
    seTax = ss + medicare;
    seDeduction = seTax / 2;
  }

  const agi = Math.max(0, income - seDeduction);
  const standardDeduction = STANDARD_DEDUCTION[input.filingStatus];
  const taxableIncome = Math.max(0, agi - standardDeduction);
  const { tax: rawTax, marginal } = bracketTax(taxableIncome, input.filingStatus);

  let ctc = Math.max(0, input.dependents) * CTC_PER_CHILD;
  const over = Math.max(0, agi - CTC_PHASEOUT_START[input.filingStatus]);
  ctc = Math.max(0, ctc - Math.ceil(over / 1000) * 50);
  // Simplification: treat the credit as non-refundable beyond income tax.
  const incomeTax = Math.max(0, rawTax - ctc);
  const creditUsed = rawTax - incomeTax;

  const totalTax = incomeTax + seTax;
  const totalPayments = Math.max(0, input.withheld) + Math.max(0, input.estimatedPayments ?? 0);
  const diff = totalPayments - totalTax;

  const round = (n: number) => Math.round(n);
  return {
    taxYear: TAX_YEAR,
    type: diff >= 0 ? "refund" : "owed",
    amount: round(Math.abs(diff)),
    totalTax: round(totalTax),
    incomeTax: round(incomeTax),
    selfEmploymentTax: round(seTax),
    taxableIncome: round(taxableIncome),
    standardDeduction,
    childTaxCredit: round(creditUsed),
    totalPayments: round(totalPayments),
    effectiveRate: income > 0 ? Math.round((totalTax / income) * 1000) / 10 : 0,
    marginalRate: Math.round(marginal * 100),
  };
}
