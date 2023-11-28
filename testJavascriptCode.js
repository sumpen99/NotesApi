const objectLength = (obj) => {
    if(Object.getPrototypeOf(obj) === Object.prototype){
        return Object.getOwnPropertyNames(obj).length || Object.getOwnPropertySymbols(obj).length;
    }
    return 0;
}

const isEmptyObject = (obj) => {
    return (
      Object.getPrototypeOf(obj) === Object.prototype &&
      Object.getOwnPropertyNames(obj).length === 0 &&
      Object.getOwnPropertySymbols(obj).length === 0
    );
}


const properties = [
    {prop:"username",toCheck:[{type:"PropCheck.MIN_LENGTH",value:3},{type:"PropCheck.MAX_LENGTH",value:255}]},
    {prop:"email",toCheck:[{type:"PropCheck.EMAIL",value:""}]},
    {prop:"password",toCheck:[{type:"PropCheck.PASSWORD",value:""}]},
    {prop:"firstname",toCheck:[{type:"PropCheck.MAX_LENGTH",value:255}]},
    {prop:"lastname",toCheck:[{type:"PropCheck.MAX_LENGTH",value:255}]}
];

console.log(properties.length);