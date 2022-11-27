/*
test={"Mass Times": {
         "Saturday": "830, 1600",
         "Sunday": "730, 930, 1130, 1800",
         "Monday": "630, 830",
         "Tuesday": "630, 830",
         "Wednesday": "630, 830",
         "Thursday": "630, 830",
         "Friday": "630, 830"
      },
      "Holy Day": {
         "Vigil": 1600,
         "Day Of": "630, 900, 1200, 1900"
      },
      "Confessions": {
         "Placeholder": "Sat 1500, 45",
         "Saturday": "1500, 45",
         "Sunday": null,
         "Monday": null,
         "Tuesday": null,
         "Wednesday": null,
         "Thursday": null,
         "Friday": null
      },
      "Adoration": {
         "Placeholder": "-",
         "Is24hour": null,
         "Saturday": null,
         "Sunday": null,
         "Monday": null,
         "Tuesday": null,
         "Wednesday": null,
         "Thursday": null,
         "Friday": null
      }}
      */
let DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let WEEKEND = ["Saturday", "Sunday"]

// TODO: Handle edge case that occurs at the end of each day (pre-process events into lookup table?)

function stateOfParish(parish, dayOfWeekNum, hour, minute) {
  /*
   * Given a parish (from live.json), day of week and timestamp, returns the 
   * activity at that parish at that moment in time
   * 
   * Returns "nothing", "mass", "confession", or "adoration"
   */
  let result = "nothing"
  if (isMassTime(parish, dayofWeekNum, hour, minute)) {
    result = "mass"
  } elif (isConfessionTime(parish, dayOfWeekNum, hour, minute)) {
    result = "confession"
  } elif (isAdorationTime(parish, dayOfWeekNum, hour, minute)) {
    result = "adoration"
  }
  return result
}

minuteOfDay(hour, minute) {
  return hour * 60 + minute
}

minutesSinceEventStart(eventHour, eventMinute, currentHour, currentMinute) {
  return minuteOfDay(currentHour, currentMinute) - minuteOfDay(eventHour, eventMinute)
}

function isMassTime(parish, dayOfWeekNum, hour, minute) {
  let dayOfWeek = DAYS_OF_WEEK[dayOfWeekNum];

  let todaysMassTimes = parish["Mass Times"][dayOfWeek]
  let isWeekend = WEEKEND.includes(dayOfWeek)
  let duration = 60 ? isWeekend : 30
  if (todaysMassTimes === null) {
    todaysMassTimes = []
  } else {
    todaysMassTimes = todaysMassTimes.split(",").map(massTime => massTime.strip())
  }

  for (let massTime of todaysMassTimes) {
    massHour = parseInt(massTime.slice(0,-2))
    massMinute = parseInt(massTime.slice(-2))
    minutesSinceStart = minutesSinceEventStart(massHour, massMinute, hour, minute)
    if (minutesSinceEventStart < duration && minutesSinceEventStart > 0) {
      return true
    }
  }
  return false
}

function isConfessionTime(parish, dayOfWeekNum, hour, minute) {
  let dayOfWeek = DAYS_OF_WEEK[dayOfWeekNum];
  let todaysConfessionTimes = parish["Confessions"][dayOfWeek]
  let confessionTimeSegments = todaysConfessionTimes.split(",").map(seg => seg.strip());
  return false
}

function isAdorationTime(parish, dayOfWeeknum, hour, minute) {
  return false
}

function activeParishes (state)  {
  //once the proper chronos code is in place above, sort through and return all active parishes based by state. Use this to either filter geoJson, or add some sort of a status indicator in the json return (line 27, or thereabouts) which one can filter geoJson by.
  return false
}