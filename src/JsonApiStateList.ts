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
 * Last modified: 2019.11.26 at 20:24
 */

import {PlainObject} from "@labor-digital/helferlein/lib/Interfaces/PlainObject";
import {forEach} from "@labor-digital/helferlein/lib/Lists/forEach";
import {getPath} from "@labor-digital/helferlein/lib/Lists/Paths/getPath";
import {hasPath} from "@labor-digital/helferlein/lib/Lists/Paths/hasPath";
import {isPlainObject} from "@labor-digital/helferlein/lib/Types/isPlainObject";
import {isUndefined} from "@labor-digital/helferlein/lib/Types/isUndefined";
import {ApiPagination, JsonApiResponse, StateListForEachCallbackType} from "./JsonApi.interfaces";
import {JsonApiState} from "./JsonApiState";
import {State} from "./State";

export class JsonApiStateList {
	
	/**
	 * The pagination object or null
	 */
	protected _pagination: ApiPagination | null;
	
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
	protected _byOrder: Array<JsonApiState>;
	
	/**
	 * The list of states we are holding -> by their entity id
	 */
	protected _byId: PlainObject<JsonApiState>;
	
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
			const state = new JsonApiState({
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
	 * Returns the reference to the raw response object
	 */
	public get response(): JsonApiResponse {
		return this._response;
	}
	
	/**
	 * Iterates over all main entities in this state
	 * @param callback
	 */
	public forEach(callback: StateListForEachCallbackType) {
		return forEach(this._byOrder, (item: JsonApiState) => {
			return callback(item, item.get("id"));
		});
	}
	
	/**
	 * Returns a single item of the list by the entities id
	 * @param id
	 */
	public get(id: string | number): JsonApiState | undefined {
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
	public getAll(): PlainObject {
		return this._byOrder;
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
	public get pagination(): ApiPagination {
		return this._pagination;
	}
	
	/**
	 * Returns the meta information that was given by the api
	 */
	public get meta(): State {
		return this._meta;
	}
}