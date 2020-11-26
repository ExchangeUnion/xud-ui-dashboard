import { from, fromEvent, Observable, of } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { isElectron, sendMessageToParent } from "./common/appUtil";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { Info } from "./models/Info";
import { SetupStatusResponse } from "./models/SetupStatusResponse";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";
import io from "socket.io-client";

const url =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : window.location.origin;
const path = `${url}/api/v1`;
const xudPath = `${path}/xud`;

const logError = (url: string, err: string) => {
  if (isElectron()) {
    sendMessageToParent(`logError: requestUrl: ${url}; error: ${err}`);
  }
};

const logAndThrow = (url: string, err: string) => {
  logError(url, err);
  throw err;
};

const fetchJsonResponse = <T>(url: string): Observable<T> => {
  return from(fetch(`${url}`)).pipe(
    mergeMap((resp: Response) => resp.json()),
    catchError((err) => logAndThrow(url, err))
  );
};

const fetchStreamResponse = <T>(url: string): Observable<T | null> => {
  return new Observable((subscriber) => {
    fetch(url)
      .then((response) => {
        if (!response.body) {
          subscriber.next(null);
          return;
        }
        const reader = response.body.getReader();

        const processText = ({
          done,
          value,
        }: any): Promise<
          | ReadableStreamReadResult<T>
          | ReadableStreamReadDoneResult<T>
          | undefined
        > => {
          if (done) {
            subscriber.complete();
            return Promise.resolve(undefined);
          }

          const stringValue = new TextDecoder("utf-8").decode(value);
          const items = stringValue
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => !!item);
          const newestItem = items[items.length - 1];
          try {
            const jsonValue = JSON.parse(newestItem);
            subscriber.next(jsonValue);
          } catch (err) {
            subscriber.next(null);
          }
          return reader.read().then(processText);
        };

        reader.read().then(processText);
      })
      .catch((e) => {
        logError(url, e);
        subscriber.error(e);
      });
  });
};

const io$: Observable<SocketIOClient.Socket> = of(
  io(url!, {
    path: "/socket.io/",
    transports: ["websocket"],
  })
);

export default {
  setupStatus$(): Observable<SetupStatusResponse | null> {
    const requestUrl = `${path}/setup-status`;
    return fetchStreamResponse(requestUrl);
  },

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

  sio: {
    io$,
    console$(id: string): Observable<any> {
      return io$.pipe(mergeMap((io) => fromEvent(io, `console.${id}.output`)));
    },
  },
};
