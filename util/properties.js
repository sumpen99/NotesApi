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


const containsSpecialChar = (input) =>{
    var specials = /[^A-Za-z 0-9]/g;
    return specials.test(input);
}

const isEmptyObject = (obj) => {
    return (
      Object.getPrototypeOf(obj) === Object.prototype &&
      Object.getOwnPropertyNames(obj).length === 0 &&
      Object.getOwnPropertySymbols(obj).length === 0
    );
}

const objectLength = (obj) => {
    if(Object.getPrototypeOf(obj) === Object.prototype){
        return Object.getOwnPropertyNames(obj).length || Object.getOwnPropertySymbols(obj).length;
    }
    return 0;
}


const validate = (properties,body,title,requiredToPass) =>{
    let errorDescription = `Unable to perform ${title}, encountered following errors -> `;
    let errorMessage = "";
    try{
        const item = JSON.parse(body);
        const outPut = {}
        properties.forEach((propertie) =>{
            const {prop,toCheck} = propertie;
            if(!item[prop]){ errorMessage += ` [ Missing parameter -> ${prop} <- ], `; }
            else{
                let newErrors = "";
                toCheck.forEach((check) =>{
                    const type = check.type;
                    const value = check.value;
                    switch(type){
                        case PropCheck.CONTAINS:
                            if(!item[prop].includes(value)){ newErrors += `[ Invalid -> ${prop} <-. Does not contain -> ${value} <- ], `;}
                            break;
                        case PropCheck.EMAIL:
                            // In a real application we should do a proper email verification, script -> send to adress or something... !
                            if(!item[prop].includes("@") || (item[prop].length < 5 || item[prop].length > 255)){ newErrors += `[ Invalid email provided ], `;} 
                            break;
                        case PropCheck.MIN_LENGTH:
                            if(item[prop].length < parseInt(value)){ newErrors += `[ Invalid -> ${prop} <-. Length is less then -> ${value} <- chars. ], `;}
                            break;
                        case PropCheck.MAX_LENGTH:
                            if(item[prop].length > parseInt(value)){ newErrors += `[ Invalid \\"${prop} <-. Length is greater then -> ${value} <- chars. ], `;}
                            break;
                        case PropCheck.PASSWORD:
                            let errors = "";
                            if(item[prop].length < 6){ errors += ` Length must be greater then 5 chars,`}
                            if(item[prop].length > 50){ errors += ` Length must be less or equal to 50 chars,`}
                            if(item[prop].search(/\d/) == -1){ errors += ` Has to contain at least one number [0-9],`}
                            if(item[prop].search(/[a-zA-Z]/) == -1){ errors += ` Has to contain at least one letter [a-z,A-Z],`}
                            if(errors){newErrors += `[ Invalid -> password <-. Did not meet following criteria: ${errors} ] `;}
                            break;
                        case PropCheck.NUMBER:
                            if(item[prop].search(/\d/) == -1){ newErrors += `[ Invalid -> ${prop} <-. Does not contain at least one number -> 0-9 <- ], `};
                            break;
                        case PropCheck.LETTERS:
                            if(item[prop].search(/[a-zA-Z]/) == -1){ newErrors += `[ Invalid -> ${prop} <-. Does not contain at least one letter -> a-Z,A-Z <- ], `}
                            break;
                        case PropCheck.SPECIAL_CHAR:
                            if(!containsSpecialChar(item[prop])){ newErrors += `[ Invalid -> ${prop} <-. Does not contain at least one special character ], `}
                            break;
                        default:break
                    }
                })
                if(newErrors){ errorMessage += newErrors;}
                else{outPut[prop] = item[prop];}
            }
            
        })

        let propertiesPassed = objectLength(outPut);
        if(propertiesPassed >= requiredToPass ){ 
            return {
                passed:true,
                item:outPut,
                meta:{
            propertiesChecked:properties.length,
            propertiesPassed:propertiesPassed,
            requiredToPass:requiredToPass,
            hasErrors: propertiesPassed !== properties.length,
            errorMessage:errorMessage
        }};}
        
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