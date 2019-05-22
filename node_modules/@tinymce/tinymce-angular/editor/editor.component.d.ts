import { AfterViewInit, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Events } from './Events';
export declare class EditorComponent extends Events implements AfterViewInit, ControlValueAccessor, OnDestroy {
    private platformId;
    private elementRef;
    private element;
    private editor;
    ngZone: NgZone;
    cloudChannel: string | undefined;
    apiKey: string | undefined;
    init: {
        [key: string]: any;
    } | undefined;
    id: string;
    initialValue: string | undefined;
    inline: boolean | undefined;
    tagName: string | undefined;
    plugins: string | undefined;
    toolbar: string | string[] | null;
    private _disabled;
    disabled: boolean;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(elementRef: ElementRef, ngZone: NgZone, platformId: Object);
    writeValue(value: string | null): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    createElement(): void;
    initialise(): void;
    private initEditor(initEvent, editor);
}
