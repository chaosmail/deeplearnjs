/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as test_util from '../test_util';
import {MathTests} from '../test_util';

import * as linalg from './linalg';
import {Array2D} from './ndarray';

// math.linalg.identity
{
  const tests: MathTests = it => {
    it('creates 2x2 identity matrix', math => {
      const n = 2;
      const result = linalg.identity(n);

      expect(result.rank).toEqual(2);
      expect(result.shape).toEqual([2, 2]);
      test_util.expectArraysClose(result, [1, 0, 0, 1]);
    });

    it('creates 3x3 identity matrix', math => {
      const n = 3;
      const result = linalg.identity(n);

      expect(result.rank).toEqual(2);
      expect(result.shape).toEqual([3, 3]);
      test_util.expectArraysClose(result, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });

    it('creates 4x4 identity matrix', math => {
      const n = 4;
      const result = linalg.identity(n);

      expect(result.rank).toEqual(2);
      expect(result.shape).toEqual([4, 4]);
      test_util.expectArraysClose(
          result, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    });
  };

  test_util.describeMathCPU('linalg.identity', [tests]);
}

// math.linalg.inv
{
  const tests: MathTests = it => {
    it('computes inverse of 2x2 matrix', math => {
      const input = Array2D.new([2, 2], [1, 2, 3, 4]);
      const result = linalg.inv(input);

      expect(result.shape).toEqual(input.shape);
      test_util.expectArraysClose(result, [-2, 1, 1.5, -0.5]);
    });

    it('computes inverse of 3x3 matrix', math => {
      const input = Array2D.new([3, 3], [1, 2, 3, 4, -1, 3, 1, -2, 3]);
      const result = linalg.inv(input);

      expect(result.shape).toEqual(input.shape);
      test_util.expectArraysClose(
          result, [-0.0833, 0.33, -0.25, 0.25, 0., -0.25, 0.1944, -0.11, 0.25]);
    });

    it('computes inverse of 3x3 matrix', math => {
      const input = Array2D.new(
          [4, 4], [1, 2, 3, 4, -1, 3, 1, -2, 3, 2, 1, 4, 4, 2, 1, -4]);
      const result = linalg.inv(input);

      expect(result.shape).toEqual(input.shape);
      test_util.expectArraysClose(result, [
        -0.03571, -0.1429, 0.1071, 0.1429, -0.1696, 0.3214, 0.2589, -0.07143,
        0.4643, -0.1429, -0.3929, 0.1429, -4.464e-3, -0.01786, 0.1384, -0.1071
      ]);
    });
  };

  test_util.describeMathCPU('linalg.inv', [tests]);
}
