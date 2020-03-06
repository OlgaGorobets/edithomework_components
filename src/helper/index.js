export function hasSomeParentTheClass(element, classname) {
    if (element.className && element.className.split && element.className.split(' ').indexOf(classname)>=0) return true;
    return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}
export function formatDate(date) {
	const monthNames = ["Jan", "Feb", "March", "Apr", "May", "June",
	  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	
    let d = date ? new Date(date) : new Date(),
        month = '' + monthNames[d.getMonth()],
        day = '' + d.getDate(),
        year = d.getFullYear(),
		h = d.getHours(),
		m = d.getMinutes();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return day + " " + month + "," + year + " " + h + ":" + m;
}
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
export function getNextNumber(lastId) {
	let val = lastId.toString().match(/\d+/);	
	val = val ? val[0] : val;
	let numb = parseInt(val);
	console.log(numb, "numb");
	return numb ? numb + 1 : lastId + "1";
}
export function getNextId(name, arr) {
	let num = 0;	
	while(arr.length > 0 && arr.filter((it)=>{return parseInt(it.id.toString().replace(name, ""))==num}).length>0){
		num = parseInt(getRandomArbitrary(0, 100000));
	}
	
	return name + num
}