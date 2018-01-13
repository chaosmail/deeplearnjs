import {Array2D} from './ndarray';

export type TypedArray = Float32Array|Uint8Array|Int32Array;

/**
 * Computes the inverse of an Array2D using Gauss-Jordan elimination
 * @param x The 2D array to inverse.
 */
export function inv(x: Array2D) {
  const cols = x.shape[0];
  const rows = x.shape[1];
  const str0 = x.strides[0];
  const A: Array2D = Array2D.like(x).asType('float32');
  const dataA = A.dataSync();
  const I: Array2D = identity(cols).asType('float32');
  const dataI = I.dataSync();

  const getMaxRowIndex = (data: TypedArray, x0: number) => {
    // find index of greates value in this row
    let idx = -1;
    let val = Number.NEGATIVE_INFINITY;
    for (let y = x0; y < rows; ++y) {
      const curr = Math.abs(data[str0 * y + x0]);
      if (curr > val) {
        idx = y;
        val = curr;
      }
    }
    return [idx, val];
  };

  const swapRows = (data: TypedArray, y0: number, y1: number) => {
    const tmp = data.slice(str0 * y0, str0 * y0 + cols);
    data.set(data.slice(str0 * y1, str0 * y1 + cols), str0 * y0);
    data.set(tmp, str0 * y1);
  };

  // iterate over all rows
  for (let outerRow = 0; outerRow < cols; ++outerRow) {
    const c = getMaxRowIndex(dataA, outerRow);
    const maxIdx = c[0];
    const maxVal = c[1];

    // swap the row with the maximum value to the current position
    swapRows(dataA, outerRow, maxIdx);
    swapRows(dataI, outerRow, maxIdx);

    // divide all values in this row by the maximum value
    for (let xi = 0; xi < cols; ++xi) {
      dataA[str0 * outerRow + xi] /= maxVal;
      dataI[str0 * outerRow + xi] /= maxVal;
    }

    // iterate over all rows but the current one
    for (let innerRow = 0; innerRow < rows; ++innerRow) {
      if (innerRow !== outerRow) {
        const r = dataA[str0 * innerRow + outerRow];
        for (let xi = 0; xi < cols; ++xi) {
          dataA[str0 * innerRow + xi] -= dataA[str0 * outerRow + xi] * r;
          dataI[str0 * innerRow + xi] -= dataI[str0 * outerRow + xi] * r;
        }
      }
    }
  }
  return I;
}

/**
 * Returns an n x n identy Array2D
 * @param n Dimension of the identity
 */
export function identity(n: number): Array2D {
  const out = Array2D.zeros([n, n], 'float32');
  const dataOut = out.dataSync();
  const str0 = out.strides[0];
  for (let i = 0; i <= n; ++i) {
    dataOut[str0 * i + i] = 1;
  }
  return out;
}
