function process_data(data_lines){
    var sorted_data_by_emp_couple = [];
    var len_data = data_lines.length;
    for(var i=0; i< len_data; i++){
      for(var j=i+1; j < len_data-1; j++){
          emp = data_lines[i].split(", ");
          current_emp = data_lines[j].split(", ");
          emp_start = convert_date(emp[2]);
          emp_end = convert_date(emp[3]);
          current_emp_start = convert_date(current_emp[2]);
          current_emp_end = convert_date(current_emp[3]);
          console.log(current_emp_end);
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
    return sorted_data_by_emp_couple
}

function convert_date(date_string){
    if (date_string == "NULL"){
        date_string = replase_null(date_string)
    }
    var date = new Date(date_string);
    return date;
}

function replase_null(date){
  var timeElapsed = Date.now();
  var date_today = (new Date(timeElapsed));
  var date = new Date(date_today);
  return date;
}

function is_date_in_period(date_first, date_second, date){
    var res = false;
    if ((date.toDateString() >= date_first.toDateString()) && (date.toDateString() < date_second.toDateString())){
        res = true;
      }
    return res;
  }


function get_days(date_list){
    days = parseInt((date_list[1] - date_list[0]) / (1000 * 60 * 60 * 24), 10);
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
    if(date_second_end.toDateString() > date_first_end.toDateString()){
        end_period = date_second_end;
      }else{
        end_period = date_first_end;
      }

    return new Array(start_period, end_period);
}

function data_table(procesing_data){
  var str_table = procesing_data[0];
  return str_table;
}
