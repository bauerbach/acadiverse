//This file is used for determining if it is a holiday, in order for certain holiday-specific features
// such as gifts to work.
//Format: "{startMonth, startDate, startHour, startMinute, endMonth, endDate, endHour, endMinute]".
//For events starting on a certain day of the month, use '["FIRSTOFMONTH", month, weekday, duration (in days)]".'
//"FIRSTOFMONTH" events will start at midnight and end at 23:59 (11:59 PM).
//Months and weekdays start from 0 rather than 1.
//NOTE: All times will be in local time for the server.
//This is for US holidays only; international versions of Acadiverse will have their own config files for holidays.

module.exports = {
    NEW_YEARS: [11, 31, 0, 0, 0, 1, 23, 59, "New Year's"], //December 31 - January 1.
    VALENTINES_DAY: [1, 14, 0, 0, 1, 14, 23, 59, "Valentine's Day"], //February 14 (0:00-23:59).
    APRIL_FOOLS: [3, 1, 0, 0, 3, 1, 23, 59, "April Fools' Day"], //April 1 (0:00-23:59).
    TEACHER_APPRECIATION_WEEK: ["FIRSTOFMONTH", 4, 1, 5, "Teacher Appreciation Week"], //First Monday of May, for 5 days.
    FOURTH_OF_JULY: [6, 4, 0, 0, 6, 4, 23, 59, "4th of July"], //July 4 (0:00-23:59).
    ACADIVERSE_ANNIVERSARY: [9, 2, 0, 0, 9, 9, 23, 59, "Acadiverse's Birthday"], //September 2 - September 9.
    HALLOWEEN: [9, 30, 0, 0, 9, 31, 23, 59, "Halloween"], //October 30 - October 31.
    ADVENT: [11, 1, 0, 0, 11, 24, 23, 59, "Advent Calendar"], //December 1 - December 24.
    CHRISTMAS: [11, 25, 0, 0, 11, 25, 23, 29, "Christmas"] //December 25 (0:00-23:59).
}