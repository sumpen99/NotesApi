
const user_by_username = (username) =>{
    return{
        TableName: process.env.DYNAMO_DB_TABLE,
        IndexName: process.env.GSI_ONE,
        KeyConditionExpression:"#pk = :pk",
        ProjectionExpression: "firstname,lastname,username,password,id,createdAt",
        ExpressionAttributeNames: {"#pk":"PK_1"},
        ExpressionAttributeValues:{":pk": `USER#${username}`},
        ScanIndexForward:false,
    };
}

module.exports = {
    user_by_username,
}
/*
const FILTER_QUERY_DATES = Object.freeze({
    CHECK_IN_CHECK_OUT:"CHECK_IN_CHECK_OUT",
    CHECK_IN:"CHECK_IN",
    CHECK_OUT:"CHECK_OUT",
});

const user_by_username = (username) =>{
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk",
        ProjectionExpression: "firstname,lastname,username,password",
        ExpressionAttributeNames: {"#pk":"PK_1"},
        ExpressionAttributeValues:{":pk": `${username}`},
        ScanIndexForward:false,
    };
}

const available_room_by_size = (dateRangeList,roomSize) =>{
    const q = filterExpressionAndExpressionAttribute(dateRangeList);
    q.expressionAttribute[":pk"] = "ROOM";
    q.expressionAttribute[":sk"] = `${roomSize}`;
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk AND #sk = :sk",
        ProjectionExpression: "id, roomNumber, roomPrice, roomSize",
        FilterExpression:q.filterExpression,
        ExpressionAttributeNames: {"#pk":"PK_1","#sk":"SK_1"},
        ExpressionAttributeValues:q.expressionAttribute,
        ScanIndexForward:false,
    };
}

const available_room_without_size = (dateRangeList) =>{
    const q = filterExpressionAndExpressionAttribute(dateRangeList);
    q.expressionAttribute[":pk"] = "ROOM";
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk",
        ProjectionExpression: "id, roomNumber, roomPrice, roomSize",
        FilterExpression:q.filterExpression,
        ExpressionAttributeNames: {"#pk":"PK_1"},
        ExpressionAttributeValues:q.expressionAttribute,
        ScanIndexForward:false,
    };
}

const all_rooms_in_the_hotel = () =>{
    q.expressionAttribute[":pk"] = "ROOM";
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk",
        ProjectionExpression: "id, roomNumber, roomPrice, roomSize",
        ExpressionAttributeNames: {"#pk":"PK_1"},
        ExpressionAttributeValues:q.expressionAttribute,
        ScanIndexForward:false,
    };
}

const active_bookings = () =>{
    return allConfirmedBookings();
}

const active_bookings_with_date_range = (dateRange,filter) =>{
    switch(filter){
        case FILTER_QUERY_DATES.CHECK_IN_CHECK_OUT: return allConfirmedBookingsWithCheckInDateAndCheckOutDate(dateRange.checkInDate,dateRange.checkOutDate);
        case FILTER_QUERY_DATES.CHECK_IN: return allConfirmedBookingsWithCheckInDate(dateRange.checkInDate);
        case FILTER_QUERY_DATES.CHECK_OUT: return allConfirmedBookingsWithCheckOutDate(dateRange.checkOutDate);
        default: return allConfirmedBookings();
    }
}

const allConfirmedBookings = () =>{
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk",
        ProjectionExpression: "id, checkInDate, checkOutDate, numberOfGuests,numberOfRooms,referencePerson.#n",
        ExpressionAttributeNames: {"#pk":"PK_1","#n":"name"},
        ExpressionAttributeValues:{":pk": "BOOKING#CONFIRMED"},
        ScanIndexForward:false,
    };
}

const allConfirmedBookingsWithCheckInDateAndCheckOutDate = (checkInDate,checkOutDate) =>{
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
        KeyConditionExpression:"#pk = :pk AND #sk_1 BETWEEN :sk1 AND :sk2",
        ProjectionExpression: "id, checkInDate, checkOutDate, numberOfGuests,numberOfRooms,referencePerson.#n",
        FilterExpression:"#sk_2 <= :sk2",
        ExpressionAttributeNames: {"#pk":"PK_1","#sk_1":"SK_1","#sk_2":"checkOutDate","#n":"name"},
        ExpressionAttributeValues:{":pk": "BOOKING#CONFIRMED",":sk1":checkInDate,":sk2":checkOutDate},
        ScanIndexForward:false,
    };
}

const allConfirmedBookingsWithCheckInDate = (checkInDate) =>{
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
         KeyConditionExpression:"#pk = :pk AND #sk >= :sk",
         ProjectionExpression: "id, checkInDate, checkOutDate, numberOfGuests,numberOfRooms,referencePerson.#n",
         ExpressionAttributeNames: {"#pk":"PK_1","#sk":"SK_1","#n":"name"},
         ExpressionAttributeValues:{":pk": "BOOKING#CONFIRMED",":sk":checkInDate},
         ScanIndexForward:false,
     };
 }
 
 const allConfirmedBookingsWithCheckOutDate = (checkOutDate) =>{
    return{
        TableName: SERVER.TABLES.EXAMPLE,
        IndexName: SERVER.GSI.GSI_PRIMARY,
         KeyConditionExpression:"#pk = :pk AND #sk_1 < :sk1",
         ProjectionExpression: "id, checkInDate, checkOutDate, numberOfGuests,numberOfRooms,referencePerson.#n",
         FilterExpression:"#sk_2 <= :sk1",
         ExpressionAttributeNames: {"#pk":"PK_1","#sk_1":"SK_1","#sk_2":"checkOutDate","#n":"name"},
         ExpressionAttributeValues:{":pk": "BOOKING#CONFIRMED",":sk1":checkOutDate},
         ScanIndexForward:false,
     };
 }

const filterExpressionAndExpressionAttribute  = (dateRangeList) =>{
    var filterExpression = ""
    var expressionAttribute = {}
    dateRangeList.forEach((date,i) =>{
        if(i === 0){ filterExpression += `not contains (bookedDates, :d${i})` }
        else{ filterExpression += `AND not contains (bookedDates, :d${i})` }
        expressionAttribute[`:d${i}`] = date;
        if(i >= 7){throw new Error('Number of dates exceed hotel policy!'); }
    })

    return {filterExpression:filterExpression,expressionAttribute:expressionAttribute}
}

module.exports = {
    user_by_username,
    available_room_by_size,
    available_room_without_size,
    all_rooms_in_the_hotel,
    active_bookings

}
*/