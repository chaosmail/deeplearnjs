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
import {caffe} from './caffe/caffe.js';
import * as caffe_util from './caffe_util';

import {NDArray} from '../math/ndarray';
import {Model} from '../model';

export class CaffeModel implements Model {

  // TODO Map structure not compatible with object structure used in
  // models.Squeezenet
  /**
   * Model weights per layer
   * @type {Map<string, NDArray>}
   */
  protected variables: Map<string, NDArray>;

  // TODO Generalize preprocessing to support cropping
  /**
   * Preprocessing Offset
   * @type {NDArray}
   */
  protected preprocessOffset: NDArray;
  
  /**
   * Parsed .caffemodel
   * The .caffemodel file contains the model definition, parameters and weights
   * after a specific phase (train, test). 
   * @type {caffe.NetParameter}
   */
  private caffemodel: caffe.NetParameter;

  /**
   * Parsed .prototxt
   * The .prototxt file contains the model definition and parameters
   * after a specific phase (train, test).
   * @type {caffe.NetParameter}
   */
  private prototxt: caffe.NetParameter;

  constructor(private caffemodelUrl: string){}

  /**
   * Load the .caffemodel file and parse it into variables
   */
  load() {
    return caffe_util.fetchArrayBuffer(this.caffemodelUrl)
      .then(caffe_util.parseCaffeModel)
      .then((model) => {

        // Store the caffemodel for debugging
        this.caffemodel = model;

        // Store the model weights
        this.variables = caffe_util.getAllVariables(model);

        // Store the preprocessing parameters
        this.preprocessOffset = caffe_util.getPreprocessOffset(model);
      });
  }

  /**
   * Load the .prototxt file and parse it into the model
   */
  loadProto(url: string) {
    return caffe_util.fetchText(url)
      .then(caffe_util.parsePrototxt)
      .then((model) => {

        // Store the prototxt for debugging
        this.prototxt = model;
      });
  }

  predict(input: NDArray): Promise<{}> {
    throw new Error("NotImplementedError");
  }

  dispose() {
    this.preprocessOffset.dispose();
    for (const varName in this.variables) {
      this.variables.get(varName).dispose();
    }
  }
}