// Question

// Stan is looking to provide access to creators' calendars and enable fans to book meetings with them.
// Your assignment is to create an algorythm that will assess creator's calendar and return available slots for fans to book.

const minsInDay = 1440; // a day runs from 0 to 1440 minutes

function fetch_available_slots(duration, events) {
  /*
    :param duration <int>: duration of the slot we're trying to book in minutes

    :param events <list<list<datetime>>>: list of start and end dates of time slots that are already taken
        i.e. [["2023-06-20 00:00AM", "2023-06-20 00:30AM"],["2023-06-20 11:00AM", "2023-06-20 11:30AM"], ["2023-06-20 03:00PM", "2023-06-20 04:00PM"] ]

    :return <list<list<datetime>>>: list of slots a fan may book
    */

  // do some data validation on our inputs
  // we assumed a lot of the inputs are valid
  // assume  events are sorted in time order starting at midnight
  if (duration <= 0) return [];

  let freeChunks = getfreeChunks(events);
  //   return freeChunks;

  let freeSlots = getFreeSlots(freeChunks, duration);

  return freeSlots;
}

// find what chunks of time throughout the day are available. This is the inverse of the events array
const getfreeChunks = (events) => {
  let freeChunks = [];

  // loop through each event
  for (let i = -1; i < events.length; i++) {
    // pick out the chunks of time between each event
    let start = i === -1 ? 0 : events[i][1];
    let end = i === events.length - 1 ? minsInDay : events[i + 1][0];

    // remove edge cases at start where we have [0,0] and end where we have [1440,1440]
    if (!(start === 0 && end === 0) && !(start === minsInDay && end === minsInDay)) freeChunks.push([start, end]);
  }

  return freeChunks;
};

// build array of free N duration timeslots from within each free chunk
// example of freeChunks:
// [ [ 30, 660 ], [ 690, 900 ], [ 960, 1440 ] ]
const getFreeSlots = (freeChunks, duration) => {
  let freeSlots = [];

  //   loop through each free chunk of time
  freeChunks.map((chunk) => {
    let chunkStart = chunk[0];
    let chunkEnd = chunk[1];

    // calculate the number of slots we can fit in this chunk
    let numSlots = (chunkEnd - chunkStart) / duration;

    // build array of free slots
    for (let i = 0; i < numSlots; i++) {
      let slotStart = chunkStart + i * duration;
      let slotEnd = chunkStart + (i + 1) * duration;
      if (slotEnd <= chunkEnd) freeSlots.push([slotStart, slotEnd]); //make sure the end of the slot were adding is within the chunk
    }
  });

  return freeSlots;
};

//
// test cases
//

console.log(
  fetch_available_slots(180, [
    [0, 30],
    [660, 690],
    [900, 960],
  ])
);

console.log(
  fetch_available_slots(15, [
    [0, 30],
    [660, 690],
    [900, 960],
  ])
);

console.log(
  fetch_available_slots(1440, [
    [0, 30],
    [0, 30],
    [900, 960],
  ])
);
console.log(
  fetch_available_slots(0, [
    [0, 30],
    [0, 30],
    [900, 960],
  ])
);
console.log(fetch_available_slots(30, [[0, 1440]]));
