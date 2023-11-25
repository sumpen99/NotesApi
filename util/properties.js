const PropCheck = Object.freeze({
    CONTAINS,
    MIN_LENGTH,
    MAX_LENGTH,
    NUMBER,
    LETTERS,
    EMAIL,
    PASSWORD,
    SPECIAL_CHAR
});


/**
 * 
 * @param {Array} properties    - properties we need to execute function  
 * @param {Object} event        - Event to parse and test against
 * @param {String} title        - Function name to show in error message
 * @returns 
 */
const validate = (properties,event,title) =>{
    let errorDescription = `Unable to perform ${title}, encountered following errors -> `;
    let errorMessage = "";
    try{
        const item = JSON.parse(event.body);
        const outPut = {}
        properties.forEach((propertie) =>{
            const {prop,toCheck} = propertie;
            if(!item[prop]){ errorMessage += `missing parameter ${prop}`; }
            else{
                toCheck.forEach((check) =>{
                    const type = check.type;
                    const value = check.value;
                    switch(type){
                        case PropCheck.CONTAINS:
                            if(!item[prop].includes(value)){ errorMessage += `invalid ${prop}. Does not contain ${value}.`;}
                            break;
                        case PropCheck.EMAIL:
                            if(!item[prop].includes("@") || (item[prop].length < 5 || item[prop].length > 255)){ errorMessage += `invalid email provided`;} // should do a real validation of email-adress!
                            break;
                        case PropCheck.MIN_LENGTH:
                            if(item[prop].length < parseInt(value)){ errorMessage += `invalid ${prop}. Length is less then ${value} chars.`;}
                            break;
                        case PropCheck.MAX_LENGTH:
                            if(item[prop].length > parseInt(value)){ errorMessage += `invalid ${prop}. Length is greater then ${value} chars.`;}
                            break;
                        case PropCheck.PASSWORD:
                            let errors = "";
                            if(item[prop].length < 6){ errors += "[ length must be greater then 5 chars ]"}
                            if(item[prop].length > 50){ errors += "[ length must be less then 50 chars ]"}
                            if(item[prop].search(/\d/) == -1){ errors += "[ does not contain at least one number [0-9] ]"}
                            if(item[prop].search(/[a-zA-Z]/) == -1){ errors += "[ does not contain at least one letter [a-z,A-Z] ]"}
                            errorMessage += `Invalid password. Did not meet following criteria: ` += errors;
                            break;
                        case PropCheck.LETTERS:
                            if(item[prop].search(/\d/) == -1){ errorMessage += `${prop } does not contain at least one number [0-9]`};
                            break;
                        case PropCheck.NUMBER:
                            if(item[prop].search(/[a-zA-Z]/) == -1){ errors += `${prop } does not contain at least one letter [a-z,A-Z] ]`}
                            break;
                        default:break
                    }
                })
                outPut[prop] = item[prop];
            }
            
        })
        if(!errorMessage){ return {passed:true,item:outPut}; }
        errorDescription += errorMessage;
        return {passed:false,message:errorDescription}
    }
    catch(error){
        errorDescription += (errorMessage += error.message);
        return {passed:false,message:errorDescription};
    }
}

module.exports = {
    validate,
    PropCheck
}