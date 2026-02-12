import { Component } from "cc";

export abstract class BaseManager extends Component {
    abstract clean() : void;
}