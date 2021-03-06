/*
 * Copyright 2020 LABOR.digital
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Last modified: 2020.05.22 at 21:43
 */


import {forEach} from "@labor-digital/helferlein";
import {JsonApiElementInterface, JsonApiElementType, JsonApiResponse} from "../JsonApi.interfaces";
import {State} from "../State";

export class Resource extends State implements JsonApiElementInterface {
	
	/**
	 * Holds a reference to the response object
	 */
	protected _response: JsonApiResponse;
	
	/**
	 * JsonApiSingleState constructor
	 *
	 * @param response
	 */
	constructor(response: JsonApiResponse) {
		super(response.data);
		this._response = response;
		
		// Define reactive getters
		forEach(response.data, (v, k) => {
			Object.defineProperty(this, k, {
				get: function () {
					return v;
				}
			});
		});
	}
	
	/**
	 * Returns the type of state
	 */
	public get jsonElementType(): JsonApiElementType {
		return "item";
	}
	
	/**
	 * Returns the reference to the raw response object
	 */
	public get response(): JsonApiResponse {
		return this._response;
	}
}
