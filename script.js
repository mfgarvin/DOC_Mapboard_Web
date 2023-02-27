let DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let WEEKEND = ["Saturday", "Sunday"]
let ACTIVITY_ORDER = ['mass', 'confession', 'adoration', 'rocket']

// TODO: Handle edge case that occurs at the end of each day (pre-process events into lookup table?)

function minuteOfDay(hour, minute) {
  return hour * 60 + minute
}

//function minutesSinceEventStart(eventHour, eventMinute, currentHour, currentMinute) {
  //return minuteOfDay(currentHour, currentMinute) - minuteOfDay(eventHour, eventMinute)
//}

function activityIsActive(activity, day, hour, minute) {
  let targetDay = day
  let targetMinute = minuteOfDay(hour, minute)
  let activityStartMinute = minuteOfDay(activity.hourOfDay, activity.minute)
  let activityEndMinute = activityStartMinute + activity.duration
  if (activity.dayOfWeek == targetDay && activityStartMinute <= targetMinute && activityEndMinute >= targetMinute) {
    return true;
  }
  return false;
}

function defaultActivity(activity) {
  //Make an activity of "doing nothing", really for grey dots
  return {
    parishName: activity.parishName,
    lat: activity.lat,
    lon: activity.lon,
    activityName: activity.has24HourAdoration ? "adoration" : "rocket"
  }
}

function compareActivityTypes(a,b) {
  return ACTIVITY_ORDER.indexOf(a) - ACTIVITY_ORDER.indexOf(b)
}

function pickParishActivityToShow(activityA, activityB) {
  if (compareActivityTypes(activityA.activityName, activityB.activityName) <= 0) {
    return activityA;
  }
  return activityB;
}

function getParishActivitiesAtTime(activityData, day, hour, minute) {
  let results = new Map()
//  console.log(results)
  for (activity of activityData) {
    let parishName = activity.parishName;
    if (!results.has(parishName)) {
      results.set(parishName, defaultActivity(activity))
//      console.log(parishName, "Nothing...")
    }
    if (activityIsActive(activity, day, hour, minute)) {
      results.set(parishName, pickParishActivityToShow(activity, results.get(parishName)))
      console.log(parishName, activity)
    }
  }
  
  return [...results.values()]
}

// Experiment for larger map version
class MapControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.id = "mapSettings";
    this._container.className = 'mapboxgl-ctrl';
    this._container.innerHTML = `
    
    <h1> Diocese of Cleveland Status Board </h1>
    <h2> A bird's eye view of what's happening throughout the diocese </h2>
    <div>
      Parish activities as of 
      <select id="target-day">
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>
      <input type="time" id="target-time">
    </div>
  
    `
    return this._container;
  }
   
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}