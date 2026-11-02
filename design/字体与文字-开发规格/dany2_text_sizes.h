/* Dany 2 text sizes / native 502x410 pixels. Font binaries not included. */
#pragma once

#define DANY2_STATUS_TIME_PX 28
#define DANY2_READING_VALUE_PX 116
#define DANY2_PM_VALUE_MAX_PX 116
#define DANY2_PM_VALUE_MIN_PX 88
#define DANY2_PM_SEPARATOR_RATIO 0.69f
/* PM2.5 and PM10 use the same adaptive size; see pm-text-layout.js. */
#define DANY2_READING_TITLE_PX 19
#define DANY2_CO2_TITLE_PX 19
#define DANY2_CO2_TITLE_SUBSCRIPT_PX 16
#define DANY2_UNIT_TEMPERATURE_PX 40
#define DANY2_UNIT_HUMIDITY_PX 40
#define DANY2_UNIT_CO2_PX 36
#define DANY2_UNIT_PM_PX 36
#define DANY2_TREND_DURATION_PX 14
#define DANY2_TREND_AVERAGE_PX 13
#define DANY2_MATTER_TITLE_PX 20
#define DANY2_MATTER_PAIRING_CODE_PX 19
#define DANY2_MATTER_BODY_EN_PX 18
#define DANY2_MATTER_BODY_ZH_PX 17
#define DANY2_QINGPING_BODY_EN_PX 22
#define DANY2_QINGPING_BODY_ZH_PX 20
#define DANY2_POWER_BODY_EN_PX 17
#define DANY2_POWER_BODY_ZH_PX 14

/* All font sizes are integer px. PM slash uses ceil(number_px * 0.69). */
#define DANY2_PM_SEPARATOR_PX(number_px) (((number_px) * 69 + 99) / 100)
