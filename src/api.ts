import { from, fromEvent, Observable, of, throwError } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { isElectron, sendMessageToParent } from "./common/appUtil";
import { CreateReverseSwapRequest } from "./models/CreateReverseSwapRequest";
import { CreateReverseSwapResponse } from "./models/CreateReverseSwapResponse";
import { DepositResponse } from "./models/DepositResponse";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { GetServiceInfoResponse } from "./models/GetServiceInfoResponse";
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
const boltzPath = `${path}/boltz`;

const logError = (url: string, err: string) => {
  if (isElectron()) {
    const errorMsg = typeof err === "string" ? err : JSON.stringify(err);
    sendMessageToParent(`logError: requestUrl: ${url}; error: ${errorMsg}`);
  }
};

const logAndThrow = (url: string, err: string) => {
  logError(url, err);
  throw err;
};

const fetchJsonResponse = <T>(
  url: string,
  body?: BodyInit,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Observable<T> => {
  return from(fetch(`${url}`, { method, body })).pipe(
    mergeMap((resp: Response) =>
      from(resp.json()).pipe(
        mergeMap((body) => (resp.ok ? of(body) : throwError(body)))
      )
    ),
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
  boltzDeposit$(currency: string): Observable<DepositResponse> {
    return fetchJsonResponse(`${boltzPath}/deposit/${currency.toLowerCase()}`);
  },

  boltzServiceInfo$(currency: string): Observable<GetServiceInfoResponse> {
    return fetchJsonResponse(
      `${boltzPath}/service-info/${currency.toLowerCase()}`
    );
  },

  boltzWithdraw$(
    currency: string,
    data: CreateReverseSwapRequest
  ): Observable<CreateReverseSwapResponse> {
    const msgBody: FormData = new FormData();
    msgBody.append("amount", data.amount.toString());
    msgBody.append("address", data.address);
    return fetchJsonResponse(
      `${boltzPath}/withdraw/${currency.toLowerCase()}`,
      msgBody,
      "POST"
    );
  },

  unlock$(password: string): Observable<void> {
    return fetchJsonResponse(
      `${xudPath}/unlock`,
      JSON.stringify({ password }),
      "POST"
    );
  },

  sio: {
    io$,
    console$(id: string): Observable<any> {
      return io$.pipe(mergeMap((io) => fromEvent(io, `console.${id}.output`)));
    },
  },
};
