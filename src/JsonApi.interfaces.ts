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
 * Last modified: 2019.08.11 at 21:27
 */

import {PlainObject} from "@labor/helferlein/lib/Interfaces/PlainObject";
import {AxiosInstance} from "axios";
import {JsonApiState} from "./JsonApiState";

export interface JsonApiArguments {
	
	/**
	 * If given, this will override all other arguments.
	 * If not given we create our own axios instance
	 */
	axios?: AxiosInstance
	
	/**
	 * The base url for the api.
	 * If not given we will assume "$host/api/resources"
	 */
	baseUrl?: string
}

export interface JsonApiGetQuery {
	[key: string]: any;
	
	/**
	 * The filter object for this query
	 */
	filter?: PlainObject,
	
	/**
	 * The array of sort fields.
	 * Prefix the field name with a "-" to sort descending
	 */
	sort?: Array<string> | string
	
	/**
	 * The list of included objects in this request
	 */
	include?: Array<string> | string
	
	/**
	 * The list of fields that should be requested
	 * should be an object representing the resource type and it's fields as arrays
	 */
	fields?: PlainObject;
	
	/**
	 * The pagination constraints
	 */
	page?: {
		[key: string]: any;
		number?: number,
		size?: number
	}
}

export interface JsonApiResponse {
	/**
	 * True if this is a single entity result
	 */
	isSingleResult: boolean;
	
	/**
	 * The http status code of the response
	 */
	status?: number;
	
	/**
	 * The list of http headers from the response
	 */
	headers?: PlainObject;
	
	/**
	 * Either a plain object representing a single result
	 * or an array representing multiple results in a response
	 */
	data: PlainObject | Array<PlainObject>;
	
	/**
	 * Can contain the link information given by the response
	 */
	links?: PlainObject;
	
	/**
	 * Additional meta information about this response
	 */
	meta?: {
		[key: string]: any;
		
		/**
		 * Optional pagination for this response
		 */
		pagination?: PlainObject
	}
}

export interface ApiPagination {
	/**
	 * The current page we are showing
	 * @var int
	 */
	page: Number;
	
	/**
	 * The number of all pages we have
	 * @var int
	 */
	pages: Number;
	
	/**
	 * The maximum number of items on a single page
	 * @var int
	 */
	pageSize: Number;
	
	/**
	 * The number of all items in the set
	 * @var int
	 */
	itemCount: Number;
}

export interface StateListForEachCallbackType extends Function {
	/**
	 * Is called for every element of the iterated object
	 * @param value The current value
	 * @param key The current key
	 */
	(value?: JsonApiState, key?: any): boolean | any;
}