import datetime
import re
from operator import itemgetter
from os import strerror


def get_data_from_file(url_str):
    data_input = []
    try:
    	text_list = open(url_str, 'r')
    	for line in text_list:
            valid_line = validate_line(line)
            if(valid_line):
                data_input.append(valid_line)
    except IOError as e:
    	print("I/O error occurred: ", strerr(e.errno))
    data = [x for x in data_input if x != ['']]
    return data

#връща списък от речници с двойки служители работили по общ проект и броя на дните за всяка двойка
#returns a list of dictionaries with Employee couples worked on a common project
#includng the total number of the working days for each couple
def process_data(file_path):
    input_data = get_data_from_file(file_path)
    sorted_data_by_emp_couple = []
    len_data = len(input_data)
    #сравняване на служителите във файла
    #compare the Emplyees in the file
    for i in range(len_data-1):
        emp = input_data[i]
        for j in range(i+1, len_data):
            current_emp = input_data[j]
            emp_start = emp[2]
            emp_end = emp[3]
            current_emp_start = current_emp[2]
            current_emp_end = current_emp[3]

            #проверка дали двама служители имат общ проект и дали u двамата са работили по него в общ период
            #check if two Employees have a common project and both have work on it
            if (emp[1] == current_emp[1]) and (is_there_common_period(emp_start, emp_end, current_emp_start, current_emp_end)):
                #изчисляваме общия период и бройката дни
                #calculate the common period and the number of days
                period = common_period(emp_start, emp_end, current_emp_start, current_emp_end)
                common_days = get_days(period)
                sorted_data_by_emp_couple.append({
                    'Employee ID #1': emp[0],
                    'Employee ID #2': current_emp[0],
                    'ProjectID': emp[1],
                    'Days worked':common_days
                })

    return sorted_data_by_emp_couple


def validate_line(line):
    line_str = (re.sub("\n", "", line)).split(', ')
    if (len(line_str) == 4) and any(line_str):
        line_str[2] = convert_date(line_str[2])
        line_str[3] = convert_date(line_str[3])
        if line_str[2] > line_str[3]:
            line_str[2], line_str[3] = line_str[3], line_str[2]

        return line_str
    else:
        return False


def convert_date(date_string):
    monthsLong = {
        'january':'01',
        'february':'02',
        'march':'03',
        'april':'04',
        'may':'05',
        'june':'06',
        'july':'07',
        'august':'08',
        'september':'09',
        'october':'10',
        'november':'11',
        'december':'12'
        }
    monthsShort = {
        'jan':'01',
        'feb':'02',
        'mar':'03',
        'apr':'04',
        'may':'05',
        'jun':'06',
        'jul':'07',
        'aug':'08',
        'sep':'09',
        'oct':'10',
        'nov':'11',
        'dec':'12'
        }
    date_now = (datetime.datetime.now()).strftime('%Y-%m-%d')
    date_str = date_now
    if date_string.lower() == 'NULL'.lower():
            date_str = date_now
    else:
        date_str_arr = re.split('[-/.: ]', date_string)
        if len(date_str_arr) == 3:
                if len(date_str_arr[2]) == 4:
                    date_str_arr[0], date_str_arr[2] = date_str_arr[2], date_str_arr[0]
                lm = date_str_arr[1].lower()
                if date_str_arr[1] not in monthsLong.values():
                    if lm in monthsLong:
                        date_str_arr[1] = monthsLong[lm]
                    elif lm in monthsShort:
                        date_str_arr[1] = monthsShort[lm]
                date_str = "-".join(date_str_arr)

    date = datetime.datetime.strptime(date_str, ('%Y-%m-%d'))
    return date


def is_date_in_period(date_first, date_second, date):
    res = False
    if (date >= date_first) and (date <= date_second):
        res = True
    return res


def get_days(date_list):
    days = (date_list[1] - date_list[0]).days + 1
    return days


def is_there_common_period(date_first_start, date_first_end, date_second_start, date_second_end):
    res = False
    if is_date_in_period(date_first_start, date_first_end, date_second_start):
        res = True
    elif is_date_in_period(date_second_start, date_second_end, date_first_start):
        res = True

    return res

#връща списък от начална и крайна дата
#returns a list of start and end date
def common_period(date_first_start, date_first_end, date_second_start, date_second_end):
    start_period = date_first_start
    end_period = date_second_start
    if (is_date_in_period(date_first_start, date_first_end, date_second_start)):
        start_period = date_second_start
    elif (is_date_in_period(date_second_start, date_second_end, date_first_start)):
        start_period = date_first_start
    if(date_second_end > date_first_end):
        end_period = date_first_end
    else:
        end_period = date_second_end

    return [start_period, end_period]


def print_data_table(procesing_data):
    if len(procesing_data) > 0:
        line = "------------------------------------------------------------------"
        title_strings = (procesing_data[0]).keys()

        title_line = ' | '.join('{:^15}'.format(str(x)) for x in title_strings)
        print(line)
        print(title_line)
        print(line)

        for i in procesing_data:
            line_val = i.values()
            string = ' | '.join('{:^15}'.format(str(x)) for x in line_val)
            print(string)
            print(line)
    else:
        print("There are no such employees")


def print_result(procesing_data):
    if procesing_data:
        newlist = sorted(procesing_data, key=itemgetter('Days worked'), reverse=True)
        max_days = newlist[0]["Days worked"]

        the_best_couples = []

        for i in procesing_data:
            if i["Days worked"] == max_days:
                the_best_couples.append((i["Employee ID #1"], i["Employee ID #2"]))
        print("Max common days are: " + str(max_days))
        str_end = " is:"
        if(len(the_best_couples) > 1):
            str_end ="s are:  "
        print("And the best couple" + str_end)
        print(the_best_couples)
