import React, {Component, ReactElement} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import "xterm/css/xterm.css";
import api from "../../api";
import {fromEvent, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {Box} from "@material-ui/core";

type PropsType = RouteComponentProps<{ param1: string }>;

type StateType = {
  connected: boolean,
  id: string,
  error?: string,
}

class Console extends Component<PropsType, StateType> {

  ref: React.RefObject<HTMLDivElement>

  term!: Terminal

  socket!: SocketIOClient.Socket

  s3!: Subscription

  fitAddon!: FitAddon

  constructor(props: PropsType) {
    super(props);

    this.state = {
      connected: false,
      id: "?",
    }

    this.ref = React.createRef();

    // Bind methods
    this.onData = this.onData.bind(this)
    this.onResize = this.onResize.bind(this)

    this.setupTerminal();
  }

  setupTerminal() {
    this.term = new Terminal({
      fontSize: 12,
      fontFamily: "Menlo, Ubuntu Mono, Fira Code, Courier New, Courier, monospace"
    });

    const fitAddon = new FitAddon();
    this.fitAddon = fitAddon;
    this.term.loadAddon(fitAddon);

    this.term.onData(this.onData)
    this.term.onResize(this.onResize)
  }

  componentDidMount() {
    api.sio.io$.pipe(
      switchMap(io =>
        fromEvent(io, "connect")
      )
    ).subscribe(() => {
      this.setState({...this.state, connected: true})
    })

    api.sio.io$.pipe(
      switchMap(io =>
        fromEvent(io, "disconnect")
      )
    ).subscribe(() => {
      this.setState({...this.state, connected: false})
    })

    if (this.ref.current) {
      this.term.open(this.ref.current);
      this.fitAddon.fit();

      api.createConsole$().subscribe(
        (id) => {
          this.setState({...this.state, id: id})
          this.s3 = api.sio.console$(id).subscribe((data) => {
            this.term.write(data)
          })
          api.sio.io$
            .subscribe((io) => {
              console.log("io", "start", io)
              const data = JSON.stringify({
                id: id, size: {rows: 25, cols: 80}
              })
              io.emit("start", data)
            })
        },
        error => {
          this.setState({...this.state, error: error})
        })
    }
  }

  componentWillUnmount() {
    this.s3 && this.s3.unsubscribe()
    this.term.dispose()
  }

  private onData(data: string) {
    api.sio.io$
      .subscribe((io) => {
        io.emit(`console.${this.state.id}.input`, data)
      })
  }

  private onResize(event: { cols: number; rows: number }) {
    console.log("resize", event)
    this.fitAddon.fit()
    api.sio.io$
      .subscribe((io) => {
        io.emit("resize", JSON.stringify({
          id: this.state.id,
          size: event
        }))
      })
  }

  render(): ReactElement {
    return (
      <div>
        <div>WebSocket: {this.state.connected ? "connected" : "disconnected"}</div>
        <div>ID: {this.state.id}</div>
        {this.state.error && <div>Error: {JSON.stringify(this.state.error)}</div>}
        <div ref={this.ref}/>
      </div>
    );
  }
}

export default withRouter(Console);
