/**
 * Solve the square linear system A·x = b with Gaussian elimination and
 * partial pivoting. Small systems only (≤ ~20 unknowns) — enough for the
 * polynomial demos. Returns `null` when the matrix is singular.
 */
export function solveLinearSystem(A: readonly number[][], b: readonly number[]): number[] | null {
  const n = b.length;
  if (A.length !== n || A.some((row) => row.length !== n)) {
    throw new Error("solveLinearSystem: ölçülər uyğun deyil");
  }
  // Augmented copy so inputs stay untouched.
  const M = A.map((row, i) => [...row, b[i] as number]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[pivot]![col]!)) pivot = r;
    }
    if (Math.abs(M[pivot]![col]!) < 1e-12) return null;
    [M[col], M[pivot]] = [M[pivot]!, M[col]!];

    const pivotRow = M[col]!;
    for (let r = col + 1; r < n; r++) {
      const row = M[r]!;
      const factor = row[col]! / pivotRow[col]!;
      for (let c = col; c <= n; c++) row[c]! -= factor * pivotRow[c]!;
    }
  }

  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    const row = M[r]!;
    let sum = row[n]!;
    for (let c = r + 1; c < n; c++) sum -= row[c]! * x[c]!;
    x[r] = sum / row[r]!;
  }
  return x;
}
