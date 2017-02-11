import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ApiResponse } from '../models/api-response';

@Injectable()
export class AggregationService {
	private static readonly apiUrl: URL = new URL('http://api.loklak.org/api/search.json');
	private static count = 0;
	private static minified_results: boolean = true;
	private static source: string = 'cache';
	private static fields: string = 'created_at,screen_name,mentions,hashtags';

	constructor(
		private jsonp: Jsonp
	) { }

	// TODO: make the searchParams as configureable model rather than this approach.
	public fetchQuery(query: string, lastRecord = 0): Observable<ApiResponse> {
		let searchParams = new URLSearchParams();
		searchParams.set('q', query);
		searchParams.set('count',AggregationService.count.toString());
		searchParams.set('callback', 'JSONP_CALLBACK');
		searchParams.set('minified', AggregationService.minified_results.toString());
		searchParams.set('source', AggregationService.source);
		searchParams.set('fields', AggregationService.fields);
		return this.jsonp.get(AggregationService.apiUrl.toString(), {search : searchParams})
								.map(this.extractData)
								.catch(this.handleError);

	}

	private extractData(res: Response): ApiResponse {
		try {
			return <ApiResponse>res.json();
		} catch (error) {
			console.error(error);
		}
	}

	private handleError (error: any) {
		// In some advance version we can include a remote logging of errors
		let errMsg = (error.message) ? error.message :
									error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // Right now we are logging to console itself
		return Observable.throw(errMsg);
	}
}
