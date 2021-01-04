function process_data(data_lines){
    var sorted_data_by_emp_couple = [];
    var len_data = data_lines.length;
    for(var i=0; i< len_data; i++){
      for(var j=i+1; j < len_data; j++){
          emp = data_lines[i].split(", ");
          current_emp = data_lines[j].split(", ");
          emp_start = convert_date(emp[2]);
          emp_end = convert_date(emp[3]);
          current_emp_start = convert_date(current_emp[2]);
          current_emp_end = convert_date(current_emp[3]);
          if ((emp[1] == current_emp[1]) && (is_there_common_period(emp_start, emp_end, current_emp_start, current_emp_end))){
               var period = common_period(emp_start, emp_end, current_emp_start, current_emp_end);
               var common_days = get_days(period);
               sorted_data_by_emp_couple.push({'Employee ID #1': emp[0],
                'Employee ID #2':  current_emp[0],
                'ProjectID':  emp[1],
                'Days worked': common_days
              });
      }}
    }

    return sorted_data_by_emp_couple;
}

function get_total_days_by_coples(data){
  var couples_days = [];
  employee1 = data[0]['Employee ID #1'];
  employee2 = data[0]['Employee ID #2'];
  days_ = data[0]['Days worked'];
  project =  data[0]['ProjectID'];
  couples_days.push({"emps":[employee1, employee2], "days": days_, "projects":[project]});
  for(cople=1; cople < data.length; cople++){
    emp1 = data[cople]['Employee ID #1'];
    emp2 = data[cople]['Employee ID #2'];
    daysIn = data[cople]['Days worked'];
    projectID = data[cople]['ProjectID'];
    var coupleExist = false;
    var currentCouple;
    for(copleIn=0; copleIn < couples_days.length; copleIn++){
      emps = couples_days[copleIn]["emps"];
      if(emps.includes(emp1) && emps.includes(emp2)){
        coupleExist = true;
        currentCouple = couples_days[copleIn];
      }
    }
    if(coupleExist){
      currentCouple["days"]+= daysIn;
      currentCouple["projects"].push(projectID);
    }else{
      couples_days.push({"emps": [emp1, emp2], "days": daysIn, "projects":[projectID]});
    }

  }
  return couples_days;
}

function convert_date(date_string){
    var date;
    if (date_string == "NULL"){
        date = replase_null(date_string);
    }else{
      var date_arr = date_string.split("-");
      date = new Date(date_arr[0], date_arr[1]-1, date_arr[2]);
    }
    return date;
}


function replase_null(date){
  var timeElapsed = Date.now();
  var date_today = new Date(timeElapsed);
  var date_r = new Date(date_today);
  return date_r;
}

function is_date_in_period(date_first, date_second, date){
    var res = false;
    if ((date >= date_first) && (date <= date_second)){
        res = true;
      }
    return res;
  }


function get_days(date_list){
    days = (parseInt((date_list[1].getTime() - date_list[0].getTime()) / (1000 * 60 * 60 * 24), 10));
    return days;
  }


function is_there_common_period(date_first_start, date_first_end, date_second_start, date_second_end){
     var res = false;
    if (is_date_in_period(date_first_start, date_first_end, date_second_start)){
        res = true;
      }
    if (is_date_in_period(date_second_start, date_second_end, date_first_start)){
        res = true
      }

    return res
}

function common_period(date_first_start, date_first_end, date_second_start, date_second_end){
    var start_period = date_first_start;
    var end_period = date_second_start;
    if (is_date_in_period(date_first_start, date_first_end, date_second_start)){
      start_period = date_second_start;
    }
    if (is_date_in_period(date_second_start, date_second_end, date_first_start)){
        start_period = date_first_start;
      }

    if(date_second_end > date_first_end){
        end_period = date_second_end;
      }else{
        end_period = date_first_end;
      }
    return new Array(start_period, end_period);
}

function data_table(procesing_data){
  var str_table = '<table class="table">\
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
      var len_data = procesing_data.length;
      for(var i=0; i< len_data; i++){
                str_table += '<tr class="tb_row">\
                            <th scope="row">'+(i+1)+'</th>\
                            <td>'+procesing_data[i]['Employee ID #1']+'</td>\
                            <td>'+procesing_data[i]['Employee ID #2']+'</td>\
                            <td>'+procesing_data[i]['ProjectID']+'</td>\
                            <td>'+procesing_data[i]['Days worked']+'</td>\
                          </tr>'
    }
    var total_days = get_total_days_by_coples(procesing_data);
    var best_couples = [];
    var max_days = -1;
    for(var i=0; i < total_days.length; i++){
          if(total_days[i]['days'] > max_days){
            max_days = total_days[i]['days'];
          }
      }
    for(var i=0; i< total_days.length; i++){
          if(total_days[i]['days'] == max_days){
            best_couples.push({"couple": [total_days[i]['emps'][0], total_days[i]['emps'][1]], "projects":total_days[i]['projects']})
          }
        }

    str_table += '<tr class="bg-primary result">\
                <td colspan="4">The best performing couple(s) is(are):</td>\
                <td>Total days</td>\
              </tr>'
      for(var i=0; i< best_couples.length; i++){
              str_table += '<tr class="tb_row">\
                          <th scope="row">'+(i+1)+'</th>\
                          <td>'+best_couples[i]['couple'][0]+'</td>\
                          <td>'+best_couples[i]['couple'][1]+'</td>\
                          <td>'+(best_couples[i]['projects']).toString()+'</td>\
                          <td>'+max_days+'</td>\
                        </tr>'
          }
    str_table += '</tbody>\
            </table>'

  return str_table;
}
