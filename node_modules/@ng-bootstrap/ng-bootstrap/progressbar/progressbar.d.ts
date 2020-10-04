import { NgbProgressbarConfig } from './progressbar-config';
/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
export declare class NgbProgressbar {
    /**
     * The maximal value to be displayed in the progressbar.
     */
    max: number;
    /**
     * If `true`, the stripes on the progressbar are animated.
     *
     * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
     */
    animated: boolean;
    /**
     * If `true`, the progress bars will be displayed as striped.
     */
    striped: boolean;
    /**
     * If `true`, the current percentage will be shown in the `xx%` format.
     */
    showValue: boolean;
    /**
     * The type of the progress bar.
     *
     * Currently Bootstrap supports `"success"`, `"info"`, `"warning"` or `"danger"`.
     */
    type: string;
    /**
     * The current value for the progress bar.
     *
     * Should be in the `[0, max]` range.
     */
    value: number;
    /**
     * THe height of the progress bar.
     *
     * Accepts any valid CSS height values, ex. `"2rem"`
     */
    height: string;
    constructor(config: NgbProgressbarConfig);
    getValue(): number;
    getPercentValue(): number;
}
