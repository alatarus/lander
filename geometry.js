/**
 *
 * @param {DOMPoint} v1
 * @param {DOMPoint} v2
 *
 * @returns {DOMPoint}
 */
export function vector2DSum(v1, v2) {
  return new DOMPoint(v1.x + v2.x, v1.y + v2.y);
}

/**
 *
 * @param {DOMPoint} v
 * @param {number} scalar
 *
 * @returns {DOMPoint}
 */
export function scalarMultiplication(v, scalar) {
  return new DOMPoint(v.x * scalar, v.y * scalar);
}
