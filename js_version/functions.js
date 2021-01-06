function processData(dataLines){
    var sortedDataByEmpCouple = [];
    var lenData = dataLines.length;
    for(var i=0; i< lenData; i++){
      for(var j=i+1; j < lenData; j++){
          emp = dataLines[i].split(", ");
          currentEmp = dataLines[j].split(", ");
          empStart = convertDate(emp[2]);
          empEnd = convertDate(emp[3]);
          currentEmpStart = convertDate(currentEmp[2]);
          currentEmpEnd = convertDate(currentEmp[3]);
          if ((emp[1] == currentEmp[1]) && (isThereCommonPeriod(empStart, empEnd, currentEmpStart, currentEmpEnd))){
               var period = commonPeriod(empStart, empEnd, currentEmpStart, currentEmpEnd);
               var commonDays = getDays(period);
               sortedDataByEmpCouple.push({'Employee ID #1': emp[0],
                'Employee ID #2':  currentEmp[0],
                'ProjectID':  emp[1],
                'Days worked': commonDays
              });
      }}
    }

    return sortedDataByEmpCouple;
}

function getTotalDaysByCoples(data){
  var couplesDays = [];
  employee1 = data[0]['Employee ID #1'];
  employee2 = data[0]['Employee ID #2'];
  days_ = data[0]['Days worked'];
  project =  data[0]['ProjectID'];
  couplesDays.push({"emps":[employee1, employee2], "days": days_, "projects":[project]});
  for(cople=1; cople < data.length; cople++){
    emp1 = data[cople]['Employee ID #1'];
    emp2 = data[cople]['Employee ID #2'];
    daysIn = data[cople]['Days worked'];
    projectID = data[cople]['ProjectID'];
    var coupleExist = false;
    var currentCouple;
    for(copleIn=0; copleIn < couplesDays.length; copleIn++){
      emps = couplesDays[copleIn]["emps"];
      if(emps.includes(emp1) && emps.includes(emp2)){
        coupleExist = true;
        currentCouple = couplesDays[copleIn];
      }
    }
    if(coupleExist){
      currentCouple["days"]+= daysIn;
      currentCouple["projects"].push(projectID);
    }else{
      couplesDays.push({"emps": [emp1, emp2], "days": daysIn, "projects":[projectID]});
    }

  }
  return couplesDays;
}

function convertDate(dateString){
    var date;
    if (dateString == "NULL"){
        date = replaseNull(dateString);
    }else{
      var dateArr = dateString.split("-");
      date = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
    }
    return date;
}


function replaseNull(date){
  var timeElapsed = Date.now();
  var dateToday = new Date(timeElapsed);
  var dateR = new Date(dateToday);
  return dateR;
}

function isDateInPeriod(dateFirst, dateSecond, date){
    var res = false;
    if ((date >= dateFirst) && (date <= dateSecond)){
        res = true;
      }
    return res;
  }


function getDays(dateList){
    days = (parseInt((dateList[1].getTime() - dateList[0].getTime()) / (1000 * 60 * 60 * 24), 10));
    return days;
  }


function isThereCommonPeriod(dateFirstStart, dateFirstEnd, dateSecondStart, dateSecondEnd){
     var res = false;
    if (isDateInPeriod(dateFirstStart, dateFirstEnd, dateSecondStart)){
        res = true;
      }
    if (isDateInPeriod(dateSecondStart, dateSecondEnd, dateFirstStart)){
        res = true
      }

    return res
}

function commonPeriod(dateFirstStart, dateFirstEnd, dateSecondStart, dateSecondEnd){
    var startPeriod = dateFirstStart;
    var endPeriod = dateSecondStart;
    if (isDateInPeriod(dateFirstStart, dateFirstEnd, dateSecondStart)){
      startPeriod = dateSecondStart;
    }
    if (isDateInPeriod(dateSecondStart, dateSecondEnd, dateFirstStart)){
        startPeriod = dateFirstStart;
      }

    if(dateSecondEnd > dateFirstEnd){
        endPeriod = dateSecondEnd;
      }else{
        endPeriod = dateFirstEnd;
      }
    return new Array(startPeriod, endPeriod);
}

function dataTable(procesingData){
  var strTable = '<table class="table">\
                        <thead class="thead-dark">\
                          <tr>\
                            <th scope="col">#</th>\
                            <th scope="col">Employee ID #1</th>\
                            <th scope="col">Employee ID #2</th>\
                            <th scope="col">ProjectID</th>\
                            <th scope="col">Days worked</th>\
                          </tr>\
                        </thead>\
                        <tbody>'
      var lenData = procesingData.length;
      for(var i=0; i< lenData; i++){
                strTable += '<tr class="tbRow">\
                            <th scope="row">'+(i+1)+'</th>\
                            <td>'+procesingData[i]['Employee ID #1']+'</td>\
                            <td>'+procesingData[i]['Employee ID #2']+'</td>\
                            <td>'+procesingData[i]['ProjectID']+'</td>\
                            <td>'+procesingData[i]['Days worked']+'</td>\
                          </tr>'
    }
    var totalDays = getTotalDaysByCoples(procesingData);
    console.log(totalDays);
    var bestCouples = [];
    var maxDays = -1;
    for(var i=0; i < totalDays.length; i++){
          if(totalDays[i]['days'] > maxDays){
            maxDays = totalDays[i]['days'];
          }
      }
    for(var i=0; i< totalDays.length; i++){
          if(totalDays[i]['days'] == maxDays){
            bestCouples.push({"couple": [totalDays[i]['emps'][0], totalDays[i]['emps'][1]], "projects":totalDays[i]['projects']})
          }
        }

    strTable += '<tr class="bg-primary result">\
                <td colspan="4">The best performing couple(s) is(are):</td>\
                <td>Total days</td>\
              </tr>'
      for(var i=0; i< bestCouples.length; i++){
              strTable += '<tr class="tbRow">\
                          <th scope="row">'+(i+1)+'</th>\
                          <td>'+bestCouples[i]['couple'][0]+'</td>\
                          <td>'+bestCouples[i]['couple'][1]+'</td>\
                          <td>'+(bestCouples[i]['projects']).toString()+'</td>\
                          <td>'+maxDays+'</td>\
                        </tr>'
          }
    strTable += '</tbody>\
            </table>'

  return strTable;
}
