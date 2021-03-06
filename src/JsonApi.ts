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
 * Last modified: 2019.08.11 at 21:25
 */

import {
	debouncePromise,
	forEach,
	getGuid,
	getPath,
	isArray,
	isBool,
	isEmpty,
	isNull,
	isNumber,
	isObject,
	isPlainObject,
	isString,
	isUndefined,
	PlainObject
} from "@labor-digital/helferlein";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Deserializer} from "jsonapi-serializer";
import {Collection} from "./Elements/Collection";
import {Resource} from "./Elements/Resource";
import {JsonApiArguments, JsonApiElementInterface, JsonApiGetQuery, JsonApiResponse} from "./JsonApi.interfaces";
import {JsonApiState} from "./JsonApiState";
import {JsonApiStateList} from "./JsonApiStateList";

export class JsonApi {
	
	/**
	 * A unique id for this api instance
	 */
	protected _guid;
	
	/**
	 * Holds the axios instance we use for our requests
	 */
	protected _axios: AxiosInstance;
	
	/**
	 * Constructor to inject the dependencies
	 * @param args
	 */
	constructor(args?: JsonApiArguments) {
		this._guid = getGuid("json-api-");
		if (isUndefined(args)) args = {};
		if (isUndefined(args.axios)) {
			if (!isString(args.baseUrl)) args.baseUrl = window.location.protocol + "//" + window.location.host + "/api/resources/";
			this._axios = axios.create({
				baseURL: args.baseUrl
			});
		} else {
			this._axios = args.axios;
		}
	}
	
	/**
	 * Returns the axios instance we use internally
	 */
	public get axios(): AxiosInstance {
		return this._axios;
	}
	
	/**
	 * Requests a resource collection from the server
	 *
	 * @param resourceType The resource type to request from the server
	 * @param query An optional query to use when requesting the resources
	 * @param debounceLimit Can be used to debounce multiple, subsequent requests for a certain number of milli-seconds,
	 *                      before they should be actually submitted to the server. Can be used to avoid multiple request
	 *                      for text inputs or similar occurrences.
	 */
	public getCollection(resourceType: string, query?: JsonApiGetQuery, debounceLimit?: number): Promise<Collection> {
		const queryString = this.makeQueryString(query);
		const guid = this._guid + "-" + resourceType + "-" + this.makeQueryString(query);
		debounceLimit = isNumber(debounceLimit) ? debounceLimit : 0;
		return debouncePromise(guid, () => {
			return this.axios
				.get("/" + resourceType + queryString)
				.then(res => this.handleAxiosResponse(res));
		}, debounceLimit, true);
	}
	
	/**
	 * Requests a single resource item from the server
	 *
	 * @param resourceType The resource type to request from the server
	 * @param id The id of the entity to request from the server. Set this to NULL if your endpoint does not
	 *             require a unique id for requesting a single entity
	 * @param query An optional query to use when requesting the resource
	 * @param debounceLimit Can be used to debounce multiple, subsequent requests for a certain number of milli-seconds,
	 *                      before they should be actually submitted to the server. Can be used to avoid multiple request
	 *                      for text inputs or similar occurrences.
	 */
	public getResource(resourceType: string, id: number | string | null, query?: JsonApiGetQuery, debounceLimit?: number): Promise<Resource> {
		const queryString = this.makeQueryString(query);
		const guid = this._guid + "-" + resourceType + "-" + id + "-" + this.makeQueryString(query);
		debounceLimit = isNumber(debounceLimit) ? debounceLimit : 0;
		return debouncePromise(guid, () => {
			return this.axios
				.get("/" + resourceType + (isNull(id) ? "" : "/" + id) + queryString)
				.then(res => this.handleAxiosResponse(res));
		}, debounceLimit, true);
	}
	
	/**
	 * Requests a resource collection from the server
	 *
	 * @param resourceType The resource type to request from the server
	 * @param query An optional query to use when requesting the resources
	 * @param debounceLimit Can be used to debounce multiple, subsequent requests for a certain number of milli-seconds,
	 *                      before they should be actually submitted to the server. Can be used to avoid multiple request
	 *                      for text inputs or similar occurrences.
	 *
	 * @deprecated will be removed in v4.0 - use getCollection() instead.
	 */
	public get(resourceType: string, query?: JsonApiGetQuery, debounceLimit?: number): Promise<JsonApiStateList> {
		return this.getCollection(resourceType, query, debounceLimit);
	}
	
	/**
	 * Requests a single resource entity from the server
	 *
	 * @param resourceType The resource type to request from the server
	 * @param id The id of the entity to request from the server. Set this to NULL if your endpoint does not
	 *             require a unique id for requesting a single entity
	 * @param query An optional query to use when requesting the resource
	 * @param debounceLimit Can be used to debounce multiple, subsequent requests for a certain number of milli-seconds,
	 *                      before they should be actually submitted to the server. Can be used to avoid multiple request
	 *                      for text inputs or similar occurrences
	 *
	 * @deprecated will be removed in v4.0 - use getResource() instead.
	 */
	public getSingle(resourceType: string, id: number | string | null, query?: JsonApiGetQuery, debounceLimit?: number): Promise<JsonApiState> {
		return this.getResource(resourceType, id, query, debounceLimit);
	}
	
	/**
	 * Can be used to format a query object into a url conform query string
	 * @param query
	 */
	public makeQueryString(query?: JsonApiGetQuery): string {
		const string = this.formatQuery(query);
		return string.length > 0 ? "?" + string : "";
	}
	
	/**
	 * Receives a raw json api response (presumably from an ajax request)
	 * and converts it either into a json api state, or a state list object, depending on the content
	 * @param response
	 * @deprecated Will be removed in v4.0 use makeResourceOrCollection() instead!
	 */
	public makeStateOrStateList(response: PlainObject | JsonApiResponse): Promise<JsonApiState | JsonApiStateList> {
		// Check if the response is already a json api response
		if (isBool(response.isSingleResult) && !isUndefined(response.data))
			return Promise.resolve(response.isSingleResult ?
				new JsonApiState(response as JsonApiResponse) :
				new JsonApiStateList(response as JsonApiResponse));
		
		// Create using deserialization
		return this.deserializeResponse(response).then(jsonResponse => {
			if (jsonResponse.isSingleResult)
				return new JsonApiState(jsonResponse);
			return new JsonApiStateList(jsonResponse);
		});
	}
	
	/**
	 * Receives a raw json api response (presumably from an ajax request)
	 * and converts it either into a json api state, or a state list object, depending on the content
	 * @param data The data to convert into either a resource or a collection
	 */
	public makeResourceOrCollection(data: PlainObject | JsonApiResponse | JsonApiElementInterface): Promise<Resource | Collection> {
		// Check if the data is already a json api element
		if (isString((data as JsonApiElementInterface).jsonElementType))
			return Promise.resolve(data as Collection);
		
		// Check if the response is already a json api response
		if (isBool((data as JsonApiResponse).isSingleResult) && !isUndefined((data as JsonApiResponse).data))
			return Promise.resolve((data as JsonApiResponse).isSingleResult ?
				new Resource(data as JsonApiResponse) :
				new Collection(data as JsonApiResponse));
		
		// Create using deserialization
		return this.deserializeResponse(data).then(jsonResponse => {
			if (jsonResponse.isSingleResult)
				return new Resource(jsonResponse);
			return new Collection(jsonResponse);
		});
	}
	
	/**
	 * Internal response handler to create
	 * @param response
	 */
	protected handleAxiosResponse(response: AxiosResponse): Promise<JsonApiState | JsonApiStateList> {
		// Throw an error if we got a non-200 response code
		if (response.status < 200 || response.status > 299) {
			let error = getPath(response.data, ["errors", "title"]);
			if (isUndefined(error)) error = response.statusText;
			return Promise.reject(new Error(error));
		}
		
		// Extend the response data by the status code and the response headers
		const data: JsonApiResponse = response.data;
		data.status = response.status;
		data.headers = response.headers;
		
		// Create a state object for the data
		return this.makeStateOrStateList(data);
	}
	
	/**
	 * Internal helper which formats the get query object into the correct query string
	 * @param query
	 * @param prefix
	 */
	protected formatQuery(query?: JsonApiGetQuery | PlainObject, prefix?: string): string {
		if (isUndefined(query)) return "";
		
		const output = [];
		
		const formatString = (key, value): string => {
			if (isObject(value)) return this.formatQuery(value, key);
			return encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};
		
		forEach(query, (v, k) => {
			if (isEmpty(v)) v = "";
			if (!isUndefined(prefix)) k = prefix + "[" + k + "]";
			if (isArray(v)) v = v.join(",");
			const pair = formatString(k, v);
			if (pair === "") return;
			output.push(pair);
		});
		
		if (output.length === 0) return "";
		return output.join("&");
	}
	
	/**
	 * Internal helper which receives the raw result from axios and de-serializes
	 * the json api structure into a more speaking javascript object
	 * @param response
	 */
	protected deserializeResponse(response: PlainObject): Promise<JsonApiResponse> {
		// Fallback if we don't received a valid response
		if (isEmpty(response)) response = {data: {}};
		
		// Check if we got a data attribute
		if (isUndefined(response.data))
			throw new Error("Invalid json api response. There has to be a \"data\" node at the root level");
		
		// Deserialize the response
		return (new Deserializer({
			keyForAttribute: "camelCase",
			included: true
		})).deserialize(response).then((data) => {
			// Build our enriched output format
			const apiResponse: JsonApiResponse = {
				isSingleResult: !isArray(data),
				data: data
			};
			if (isPlainObject(response.meta ?? null)) apiResponse.meta = response.meta;
			if (isPlainObject(response.data.meta ?? null)) apiResponse.meta = response.data.meta;
			if (isPlainObject(response.links ?? null)) apiResponse.links = response.links;
			if (isPlainObject(response.data.links ?? null)) apiResponse.links = response.data.links;
			apiResponse.status = getPath(response, "status", 200);
			apiResponse.headers = getPath(response, "headers", {});
			
			// Done
			return apiResponse;
		});
	}
}