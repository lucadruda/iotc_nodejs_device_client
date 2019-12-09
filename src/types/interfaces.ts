// Copyright (c) Luca Druda. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { X509ProvisioningTransport, TpmProvisioningTransport, X509SecurityClient, TpmSecurityClient } from "azure-iot-provisioning-device/lib/interfaces";
import { Message } from "azure-iot-common";
import { HTTP_PROXY_OPTIONS, IOTC_CONNECTION_ERROR, IOTC_EVENTS, DeviceTransport, IOTC_LOGGING } from "./constants";
import { SymmetricKeySecurityClient } from "azure-iot-security-symmetric-key";

export class ConnectionError extends Error {
    constructor(message: string, public code: IOTC_CONNECTION_ERROR) {
        super(message);
    }
}
export class Result {
    constructor(public code?: any) {

    }
}

export type DeviceProvisioningTransport = X509ProvisioningTransport | TpmProvisioningTransport;

export type DeviceSecurityClient = X509SecurityClient | TpmSecurityClient | SymmetricKeySecurityClient;

export type SendCallback = (err: Error, result: Result) => void;


export interface IIoTCClient {

    // new(id: string, scopeId: string, authenticationType: IOTC_CONNECT, options: X509 | string): IIoTCClient
    /**
     * Get the current connection string
     */
    getConnectionString(): string;
    /**
     * Set transport protocol for the client
     * @param transport (http, mqtt or amqp)
     */
    setProtocol(transport: string | DeviceTransport): void,
    /**
     * 
     * @param modelId IoT Central model Id for automatic approval process
     */
    setModelId(modelId: string): void,
    /**
     * Set a JSON capability model
     */
    setCapabilityModel(model: any): void,
    /**
     * Set global endpoint for DPS provisioning
     * @param endpoint hostname without protocol
     */
    setGlobalEndpoint(endpoint: string): void,
    /**
     * Set network proxy for the connection
     * @param options object representing proxy configuration
     */
    setProxy(options: HTTP_PROXY_OPTIONS): void,
    /**
     * Disconnect device. Client cannot be reused after disconnect!!!
     */
    disconnect(): Promise<Result>,
    disconnect(callback: SendCallback): void,
    /**
     * Connect the device
     */
    connect(): Promise<Result>,
    connect(callback: SendCallback): void,
    /**
     * @description Send telemetry object for a particular interface
     * @param payload Message to send: can be any type (usually json) or a collection of messages
     * @param timestamp Timestamp in ISO format to set custom timestamp instead of now()
     * @param [callback] Function to execute when message gets delivered
     * @returns void or Promise<Result>
     */
    sendTelemetry(payload: any, interfaceName: string): Promise<Result>
    sendTelemetry(payload: any, interfaceName: string, callback: SendCallback): void
    sendTelemetry(payload: any, interfaceName: string, properties: any): Promise<Result>
    sendTelemetry(payload: any, interfaceName: string, properties: any, callback: SendCallback): void
    sendTelemetry(payload: any, interfaceName: string, timestamp: string): Promise<Result>
    sendTelemetry(payload: any, interfaceName: string, timestamp: string, callback: SendCallback): void
    sendTelemetry(payload: any, interfaceName: string, properties: any, timestamp: string): Promise<Result>
    sendTelemetry(payload: any, interfaceName: string, properties: any, timestamp: string, callback: SendCallback): void
    /**
    * 
    * @description Send state object for a particular interface
    * @param payload State to send: can be any type (usually json) or a collection of states
    * @param timestamp Timestamp in ISO format to set custom timestamp instead of now()
    * @param [callback] Function to execute when state information gets delivered
    * @returns void or Promise<Result>
    */
    sendState(payload: any, timestamp?: string, callback?: SendCallback): Promise<Result> | void,
    /**
     * 
     * @param payload Event to send: can be any type (usually json) or a collection of events
     * @param timestamp Timestamp in ISO format to set custom timestamp instead of now()
     * @param [callback] Function to execute when events gets triggered
     * @returns void or Promise<Result>
     */
    sendEvent(payload: any, timestamp?: string, callback?: SendCallback): Promise<Result> | void,
    /**
    * @description Send a property to an interface
    * @param payload Property to send: can be any type (usually json) or a collection of properties
    * @param [callback] Function to execute when property gets set
    * @returns void or Promise<Result>
    */
    sendProperty(payload: any, interfaceName: string): Promise<Result>
    sendProperty(payload: any, interfaceName: string, callback: SendCallback): void
    /**
     * 
     * @param eventName name of the event to listen
     * @param callback function to execute when event triggers
     */
    on(eventName: string | IOTC_EVENTS, callback: Callback): void
    /**
     * 
     * @param logLevel the log level (disable, api_only, all). Default disable
     */
    setLogging(logLevel: string | IOTC_LOGGING): void,

    /**
     * @description Check if client is connected
     * @returns check result
     */
    isConnected(): boolean,

    addInterface(inf: IoTCInterface): void

}

export interface IIoTCLogger {
    setLogLevel(logLevel: string | IOTC_LOGGING): void;
    log(message: string): void;
    debug(message: string): void;
}


export enum OperationStatus {
    SUCCESS = 200,
    FAILURE = 500
}


interface PnPItem {
    interfaceName: string,
    interfaceId?: string,
    value: any,
    name: string
}

export interface IIoTCProperty extends PnPItem {
    report(status: OperationStatus): Promise<Result>
    report(status: OperationStatus, callback: SendCallback): void
    report(status: OperationStatus, message: string): Promise<Result>
    report(status: OperationStatus, message: string, callback: SendCallback): void
}

export interface IIoTCCommand extends PnPItem {
    acknowledge(status: OperationStatus): Promise<Result>,
    acknowledge(status: OperationStatus, message: string): Promise<Result>,
    acknowledge(status: OperationStatus, callback: SendCallback): void,
    acknowledge(status: OperationStatus, message: string, callback: SendCallback): void
    update(status: OperationStatus): Promise<Result>,
    update(status: OperationStatus, message: string): Promise<Result>,
    update(status: OperationStatus, callback: SendCallback): void,
    update(status: OperationStatus, message: string, callback: SendCallback): void,
}

export type MessagesCallback = (message: Message) => void;
export type PropertiesCallback = (property: IIoTCProperty) => void;
export type CommandsCallback = (command: IIoTCCommand) => void;

export type Callback = MessagesCallback | PropertiesCallback | CommandsCallback;

export type IoTCInterface = {
    name: string,
    id: string,
    properties?: string[],
    commands?: string[],
    telemetry?: string[]
}
