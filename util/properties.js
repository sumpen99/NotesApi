/**
 * 
 * @param {Array} properties    - properties we need to execute function  
 * @param {Object} event        - Event to parse and test against
 * @param {String} title        - Function name to show in error message
 * @returns 
 */

const validate = (properties,event,title) =>{
    let success = true;
    let errorMessage = `Unable to perform ${title}, encountered following errors -> `;
    try{
        const item = JSON.parse(event.body);
        const outPut = {}
        properties.forEach((prop) =>{
            if(!item[prop]){
                success = false;
                errorMessage += prop;
            }
            else{ outPut[prop] = item[prop];}
            
        })
        if(success){ return {passed:true,item:outPut}; }
        return {passed:false,message:errorMessage}
    }
    catch(errror){
        errorMessage += errror;
        return {passed:false,message:errorMessage};
    }
}

module.exports = {
    validate
}