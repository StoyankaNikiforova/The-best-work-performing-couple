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

    return sorted_data_by_emp_couple
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
      var best_couples ="";
      var max_days = -1;
      for(var i=0; i< len_data; i++){
            if(procesing_data[i]['Days worked'] > max_days){
              max_days = procesing_data[i]['Days worked']
            }
                str_table += '<tr class="tb_row">\
                            <th scope="row">'+(i+1)+'</th>\
                            <td>'+procesing_data[i]['Employee ID #1']+'</td>\
                            <td>'+procesing_data[i]['Employee ID #2']+'</td>\
                            <td>'+procesing_data[i]['ProjectID']+'</td>\
                            <td>'+procesing_data[i]['Days worked']+'</td>\
                          </tr>'
    }
    for(var i=0; i< len_data; i++){
          if(procesing_data[i]['Days worked'] == max_days){
            best_couples += "("+procesing_data[i]['Employee ID #1']+", "+procesing_data[i]['Employee ID #2']+")"
          }
        }

    str_table += '<tr class="bg-primary">\
                <td colspan="4">The best couple(s) are '+best_couples+'  with:</td>\
                <td>'+max_days+' days!</td>\
              </tr>'
    str_table += '</tbody>\
            </table>'

  return str_table;
}
