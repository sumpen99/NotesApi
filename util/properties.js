const PropCheck = Object.freeze({
    CONTAINS:0,
    MIN_LENGTH:1,
    MAX_LENGTH:2,
    NUMBER:3,
    LETTERS:4,
    EMAIL:5,
    PASSWORD:6,
    SPECIAL_CHAR:7
});

const validate = (properties,body,title) =>{
    let errorDescription = `Unable to perform ${title}, encountered following errors -> `;
    let errorMessage = "";
    try{
        const item = JSON.parse(body);
        const outPut = {}
        properties.forEach((propertie) =>{
            const {prop,toCheck} = propertie;
            if(!item[prop]){ errorMessage += ` [ missing parameter "${prop}" ], `; }
            else{
                toCheck.forEach((check) =>{
                    const type = check.type;
                    const value = check.value;
                    switch(type){
                        case PropCheck.CONTAINS:
                            if(!item[prop].includes(value)){ errorMessage += `[ Invalid "${prop}". Does not contain "${value}". ], `;}
                            break;
                        case PropCheck.EMAIL:
                            // In a real application we should do a proper email verification, script -> send to adress !
                            if(!item[prop].includes("@") || (item[prop].length < 5 || item[prop].length > 255)){ errorMessage += `[ Invalid email provided ], `;} 
                            break;
                        case PropCheck.MIN_LENGTH:
                            if(item[prop].length < parseInt(value)){ errorMessage += `[ Invalid "${prop}" , length is less then ${value} chars. ], `;}
                            break;
                        case PropCheck.MAX_LENGTH:
                            if(item[prop].length > parseInt(value)){ errorMessage += `[ Invalid "${prop}" , length is greater then ${value} chars. ], `;}
                            break;
                        case PropCheck.PASSWORD:
                            let errors = "";
                            if(item[prop].length < 6){ errors += `" length must be greater then 5 chars ",`}
                            if(item[prop].length > 50){ errors += `" length must be less then 50 chars ",`}
                            if(item[prop].search(/\d/) == -1){ errors += `" does not contain at least one number [0-9] ",`}
                            if(item[prop].search(/[a-zA-Z]/) == -1){ errors += `" does not contain at least one letter [a-z,A-Z] ",`}
                            if(errors){errorMessage += `[ invalid "password", did not meet following criteria: ${errors} ] `;}
                            break;
                        case PropCheck.NUMBER:
                            if(item[prop].search(/\d/) == -1){ errorMessage += `[ Invalid "${prop}" does not contain at least one number [0-9] ], `};
                            break;
                        case PropCheck.LETTERS:
                            if(item[prop].search(/[a-zA-Z]/) == -1){ errorMessage += `[ Invalid "${prop}" does not contain at least one letter [a-Z,A-Z] ], `}
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
        errorDescription += `${errorMessage} ${error.message}`;
        return {passed:false,message:errorDescription};
    }
}

module.exports = {
    validate,
    PropCheck
}