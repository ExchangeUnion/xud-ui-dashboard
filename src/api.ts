import { from, Observable } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { Info } from "./models/Info";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";
import { isElectron } from "./common/appUtil";

const url =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : window.location.origin;
const path = `${url}/api/v1`;
const xudPath = `${path}/xud`;

const logAndThrow = (url: string, err: string) => {
  if (isElectron()) {
    (window as any).electron.logError(`requestUrl: ${url}; error: ${err}`);
  }
  throw err;
};

const fetchJsonResponse = <T>(url: string): Observable<T> => {
  return from(fetch(`${url}`)).pipe(
    mergeMap((resp: Response) => resp.json()),
    catchError((err) => logAndThrow(url, err))
  );
};

export default {
  status$(): Observable<Status[]> {
    return fetchJsonResponse(`${path}/status`);
  },

  statusByService$(serviceName: string): Observable<Status> {
    return fetchJsonResponse(`${path}/status/${serviceName}`);
  },

  logs$(serviceName: string): Observable<string> {
    const requestUrl = `${path}/logs/${serviceName}`;
    return from(fetch(requestUrl)).pipe(
      mergeMap((resp) => resp.text()),
      catchError((err) => logAndThrow(requestUrl, err))
    );
  },

  getinfo$(): Observable<Info> {
    return fetchJsonResponse(`${xudPath}/getinfo`);
  },

  getbalance$(): Observable<GetbalanceResponse> {
    return fetchJsonResponse(`${xudPath}/getbalance`);
  },

  tradinglimits$(): Observable<TradinglimitsResponse> {
    return fetchJsonResponse(`${xudPath}/tradinglimits`);
  },

  tradehistory$(): Observable<TradehistoryResponse> {
    return fetchJsonResponse(`${xudPath}/tradehistory`);
  },
};
