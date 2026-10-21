export function schedule(stops,startTime) {
 let minutes=Number(startTime.slice(0,2))*60+Number(startTime.slice(3));
 return stops.map((s,i)=>{const dayOffset=Math.floor(minutes/1440);const time=`${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;minutes+=s.minutes+(i<stops.length-1?15:0);return {...s,time,dayOffset};});
}
