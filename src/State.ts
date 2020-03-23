/*
 * Copyright 2019 LABOR.digital
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
 * Last modified: 2019.09.03 at 08:58
 */

import {PlainObject} from "@labor-digital/helferlein/lib/Interfaces/PlainObject";
import {getPath} from "@labor-digital/helferlein/lib/Lists/Paths/getPath";
import {isArray} from "@labor-digital/helferlein/lib/Types/isArray";
import {isEmpty} from "@labor-digital/helferlein/lib/Types/isEmpty";
import {isPlainObject} from "@labor-digital/helferlein/lib/Types/isPlainObject";
import {isString} from "@labor-digital/helferlein/lib/Types/isString";
import {isUndefined} from "@labor-digital/helferlein/lib/Types/isUndefined";

/**
 * An object representation of a simple state store.
 */
export class State {
	
	/**
	 * The registered translations on this instance
	 */
	protected _state: PlainObject;
	
	/**
	 * Inject the initial state object
	 * @param initialState
	 */
	constructor(initialState: PlainObject | any) {
		if (!isPlainObject(initialState)) {
			if (!isEmpty(initialState)) console.error("Invalid state given!", initialState);
			this._state = {};
		} else this._state = initialState;
	}
	
	/**
	 * Returns the value of the initial state
	 * @param key
	 * @param fallback
	 */
	get(key: string | Array<string>, fallback?) {
		if (isArray(key) || isString(key) && key.indexOf(".") !== -1) return getPath(this._state, key, fallback);
		if (isPlainObject(this._state) && !isUndefined(this._state[(key as string)])) return this._state[(key as string)];
		return fallback;
	}
	
	/**
	 * Returns true if a certain key exists in the state
	 * @param key
	 */
	has(key: string | Array<string>): boolean {
		return !isUndefined(this.get(key));
	}
	
	/**
	 * Similar to "has" but also checks if the value on a key is "empty". If the value is considered empty this method will return false
	 * Empty values are: NULL, undefined, 0, "", " ", {}, [] and empty Maps and Sets
	 * @param key
	 * @param includeZero By default zero (0) is not seen as "empty" if you set this to true, it will be, tho
	 */
	hasValue(key: string | Array<string>, includeZero?: boolean): boolean {
		const value = this.get(key);
		if (isUndefined(value)) return false;
		return !isEmpty(value, includeZero);
	}
	
	/**
	 * Returns all key and value pairs that are currently inside the state
	 */
	getAll(): PlainObject {
		return {...this._state};
	}
	
	/**
	 * Destroys the internal state object
	 */
	destroy() {
		this._state = undefined;
	}
}