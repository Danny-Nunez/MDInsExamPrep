/** Fixed height keeps readiness + the three metric cards aligned. */
export const DASHBOARD_METRIC_CARD_HEIGHT_CLASS = "h-[154px]";

export const DASHBOARD_METRIC_CARD_CLASS = `flex ${DASHBOARD_METRIC_CARD_HEIGHT_CLASS} w-full min-w-0 flex-col overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm`;

/** Row cards that should grow with the tallest column (e.g. Focused Practice). */
export const DASHBOARD_ROW_CARD_CLASS =
  "flex h-full min-h-[154px] w-full min-w-0 flex-col rounded-xl border border-stone-100 bg-white shadow-sm";

/** @deprecated Use DASHBOARD_METRIC_CARD_CLASS or DASHBOARD_ROW_CARD_CLASS */
export const DASHBOARD_STAT_CARD_CLASS = DASHBOARD_METRIC_CARD_CLASS;
