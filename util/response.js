module.exports = {
    create:(code,response) =>{
        return{
            statusCode:code,
            headers: {
                "ContentType": "application/json",
            },
            body: JSON.stringify(response)
        }
    },
    failed:(error) =>{
        const{ data = { message: "Internal server error"} } = error;
        return {
            statusCode: data?.code || 500,
            headers: {
                "ContentType": "application/json",
            },
            body: JSON.stringify(error.data)
        }
    },
  
}
