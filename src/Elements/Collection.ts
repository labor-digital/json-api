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
 * Last modified: 2020.05.22 at 21:45
 */

import {PlainObject} from "@labor-digital/helferlein/lib/Interfaces/PlainObject";
import {forEach} from "@labor-digital/helferlein/lib/Lists/forEach";
import {map} from "@labor-digital/helferlein/lib/Lists/map";
import {getPath} from "@labor-digital/helferlein/lib/Lists/Paths/getPath";
import {hasPath} from "@labor-digital/helferlein/lib/Lists/Paths/hasPath";
import {isPlainObject} from "@labor-digital/helferlein/lib/Types/isPlainObject";
import {isUndefined} from "@labor-digital/helferlein/lib/Types/isUndefined";
import {
	CollectionForEachCallbackType,
	JsonApiElementInterface,
	JsonApiElementType,
	JsonApiPagination,
	JsonApiResponse
} from "../JsonApi.interfaces";
import {State} from "../State";
import {Resource} from "./Resource";

export class Collection implements JsonApiElementInterface, Iterable<Resource> {
	
	/**
	 * The pagination object or null
	 */
	protected _pagination: JsonApiPagination | null;
	
	/**
	 * Additional metadata that was passed by the api
	 */
	protected _meta: State;
	
	/**
	 * Holds a reference to the response object
	 */
	protected _response: JsonApiResponse;
	
	/**
	 * The list of states we are holding -> as array by their given order
	 */
	protected _byOrder: Array<Resource>;
	
	/**
	 * The list of states we are holding -> by their entity id
	 */
	protected _byId: PlainObject<Resource>;
	
	/**
	 * JsonApiSingleState constructor
	 *
	 * @param response
	 */
	constructor(response: JsonApiResponse) {
		this._response = response;
		
		// Create pagination reference
		if (hasPath(response, ["meta", "pagination"])) {
			const p = response.meta.pagination;
			this._pagination = {
				page: !isUndefined(p.currentPage) ? p.currentPage : p.current_page,
				pages: !isUndefined(p.totalPages) ? p.totalPages : p.total_pages,
				pageSize: !isUndefined(p.perPage) ? p.perPage : p.per_page,
				itemCount: p.count
			};
		}
		
		// Fetch meta from the response
		const meta = getPath(response, ["meta"], {});
		this._meta = new State(meta);
		
		// Build the list reference
		this._byOrder = [];
		this._byId = {};
		forEach(response.data, (val: PlainObject) => {
			const state = new Resource({
				isSingleResult: true,
				data: val,
				meta: response.meta,
				links: response.links
			});
			this._byOrder.push(state);
			this._byId[state.get("id")] = state;
		});
	}
	
	/**
	 * Returns the type of state
	 */
	public get jsonElementType(): JsonApiElementType {
		return "collection";
	}
	
	/**
	 * Returns the reference to the raw response object
	 */
	public get response(): JsonApiResponse {
		return this._response;
	}
	
	/**
	 * Iterates over all main entities in this state
	 * @param callback
	 */
	public forEach(callback: CollectionForEachCallbackType) {
		return forEach(this._byOrder, (item: Resource) => {
			return callback(item, item.get("id"));
		});
	}
	
	/**
	 * Returns a single item of the list by the entities id
	 * @param id
	 */
	public get(id: string | number): Resource | undefined {
		if (isUndefined(this._byId[id])) return undefined;
		return this._byId[id];
	}
	
	/**
	 * Returns true if a certain item with the given id exists in the state list
	 * @param id
	 */
	public has(id: string | number): boolean {
		return !isUndefined(this.get(id));
	}
	
	/**
	 * Returns the raw state array
	 */
	public getAll(): Array<Resource> {
		return this._byOrder;
	}
	
	/**
	 * Returns a raw array of all contained resources converted into a plain object
	 */
	public getRaw(): Array<PlainObject> {
		return map(this._byOrder, (v: Resource) => {
			return v.getAll();
		});
	}
	
	/**
	 * Returns true if there is a pagination, false if not
	 */
	public hasPagination(): boolean {
		return isPlainObject(this._pagination);
	}
	
	/**
	 * Returns the pagination for this api state
	 */
	public get pagination(): JsonApiPagination {
		return this._pagination;
	}
	
	/**
	 * Returns the meta information that was given by the api
	 */
	public get meta(): State {
		return this._meta;
	}
	
	/**
	 * Returns the iterator for the collection
	 */
	public [Symbol.iterator](): Iterator<Resource> {
		const that = this;
		return new class implements Iterator<Resource> {
			protected _i = 0;
			
			public next(...args: [] | [undefined]): IteratorResult<Resource, any> {
				if (this._i < that._byOrder.length) {
					return {value: that._byOrder[this._i++], done: false};
				} else {
					return {value: undefined, done: true};
				}
			}
		};
	}
}