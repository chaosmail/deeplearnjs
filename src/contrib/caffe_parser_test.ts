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
import * as caffe_parser from './caffe_parser';

describe('parsePrototxt', () => {
  
  it('input layer', () => {
    const input = `layer {
      name: "data"
      type: "Input"
      top: "data"
      input_param { shape: { dim: 10 dim: 3 dim: 227 dim: 227 } }
    }`;

    const actual = caffe_parser.parsePrototxt(input);
    const expected: any = {
      layer: [
        {
          name: "data",
          type: "Input",
          top: "data",
          input_param: { shape: { dim: 10, dim: 3, dim: 227, dim: 227 }
        }
      ]
    };

    expect(actual).toEqual(expected);
  });

  it('conv layer', () => {
    const input = `layer {
      name: "conv1"
      type: "Convolution"
      bottom: "data"
      top: "conv1"
      convolution_param {
        num_output: 64
        kernel_size: 3
        stride: 2
      }
    }`;

    const actual = caffe_parser.parsePrototxt(input);
    const expected: any = {
      layer: [
        {
          name: "conv1",
          type: "Convolution",
          bottom: "data",
          top: "conv1",
          convolution_param: {
            num_output: 64,
            kernel_size: 3,
            stride: 2
          }
        }
      ]
    };

    expect(actual).toEqual(expected);
  });

  it('pool layer', () => {
    const input = `layer {
      name: "pool1"
      type: "Pooling"
      bottom: "conv1"
      top: "pool1"
      pooling_param {
        pool: MAX
        kernel_size: 3
        stride: 2
      }
    }`;

    const actual = caffe_parser.parsePrototxt(input);
    const expected: any = {
      layer: [
        {
          name: "pool1",
          type: "Pooling",
          bottom: "conv1",
          top: "pool1",
          pooling_param: {
            pool: "MAX",
            kernel_size: 3,
            stride: 2
          }
        }
      ]
    };

    expect(actual).toEqual(expected);
  });
});