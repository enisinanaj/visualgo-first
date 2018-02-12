import React, {Component} from 'react';
import {StatusBar, View, TouchableOpacity, Text, Dimensions, StyleSheet} from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

import DefaultRow from '../common/default-row';
import Colors from '../../constants/Colors';

import moment from 'moment';
import locale from 'moment/locale/it'

LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venderdì','Sabato'],
  dayNamesShort: ['D','L','M','M','J','V','S']
};

LocaleConfig.defaultLocale = 'it';

const {width, height} = Dimensions.get('window');

export default class CalendarView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: undefined,
            dueDate: undefined,
            period: undefined,
            doneButtonVisible: false
        }
    }

    renderHeader() {
        return (
          <View style={{backgroundColor: '#FFF', paddingTop: 36, borderBottomWidth:StyleSheet.hairlineWidth,
              borderBottomColor: Colors.gray, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
              <TouchableOpacity onPress={() => {this.props.closeModal([])}}>
                <Text style={{color: Colors.main, fontWeight: '200', fontSize: 18}}>Cancel</Text>
              </TouchableOpacity>
              {this.state.doneButtonVisible ? 
              <TouchableOpacity onPress={() => {this.props.onDone({start: this.state.startDate, due: this.state.dueDate})}}>
                <Text style={{color: Colors.main, fontWeight: '700', fontSize: 18}}>Done</Text>
              </TouchableOpacity> : null }
          </View>
        );
    }

    setDate(date) {
        let {dateString} = date;
        if (this.state.startDate == undefined || this.state.dueDate != undefined) {
            let newPeriod = {};
            
            newPeriod[dateString] = {selected: true, color: Colors.main, startingDate: true, endingDate: true};
            this.setState({
                startDate: date.timestamp,
                dueDate: undefined,
                period: newPeriod
            });
        } else {
            let newPeriod = this.state.period;
            newPeriod[dateString] = {selected: true, color: Colors.main, startingDate: true, endingDate: true};
            this.setState({
                dueDate: date.timestamp,
                period: newPeriod,
                doneButtonVisible: true
            });
        }
    }

    getStartDate() {
        if (this.state.startDate != undefined) {
            return moment(this.state.startDate).locale("it").format("D MMMM");
        } else {
            return "";
        }
    }

    getStartDateDay() {
        if (this.state.startDate != undefined) {
            return moment(this.state.startDate).locale("it").format("dddd");
        } else {
            return "";
        }
    }

    getDueDate() {
        if (this.state.dueDate != undefined) {
            return moment(this.state.dueDate).locale("it").format("D MMMM");
        } else {
            return "";
        }
    }

    getDueDateDay() {
        if (this.state.dueDate != undefined) {
            return moment(this.state.dueDate).locale("it").format("dddd");
        } else {
            return "";
        }
    }

    renderSelectedDateRow(base) {
        return (
            <View style={{backgroundColor: '#FFF', borderBottomWidth:StyleSheet.hairlineWidth,
            borderBottomColor: Colors.gray, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                <View style={{flex: 1, flexDirection: 'column', height: 40}}>
                    <Text style={styles.date}>{this.getStartDateDay()}</Text>
                    <Text style={styles.date}>{this.getStartDate()}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', height: 40, right: 10, position: 'absolute'}}>
                    <Text style={[styles.date, styles.alignRight]}>{this.getDueDateDay()}</Text>
                    <Text style={[styles.date, styles.alignRight]}>{this.getDueDate()}</Text>
                </View>
            </View>
        )
    }

    render () {
        return <View style={{height: height, flex: 1, flexDirection: 'column'}}>
                <StatusBar barStyle={'default'} animated={true}/>
                {this.renderHeader()}
                {this.renderSelectedDateRow()}
                <CalendarList
                    // Initially visible month. Default = Date()
                    //current={'2012-03-01'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    //maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => this.setDate(day)}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {console.log('month changed', month)}}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    // renderArrow={(direction) => (<Arrow />)}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={false}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={false}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    markedDates={this.state.period}
                    // Date marking style [simple/period/multi-dot]. Default = 'simple'
                    markingType='period'
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        //textSectionTitleColor: '#b6c1cd',
                        //selectedDayBackgroundColor: "#002BFF",
                        //selectedDayTextColor: '#ffffff',
                        //todayTextColor: Colors.main,
                        dayTextColor: Colors.main,
                        textDisabledColor: '#d9e1e8',
                        //dotColor: '#00adf5',
                        //selectedDotColor: '#ffffff',
                        monthTextColor: Colors.grayText,
                        textDayFontSize: 14,
                        textMonthFontSize: 22,
                        textDayHeaderFontSize: 18,
                        'stylesheet.calendar.header': {
                            week: {
                              marginTop: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-around'
                            },
                            header: {
                              justifyContent: 'flex-start'
                            }
                        }
                    }}
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}
                />
        </View>
    }
}


const styles = StyleSheet.create({
    selectedDates: {
        flex: 1,
        flexDirection: 'row',
        height: 80
    },
    date: {
        color: 'red',
        fontWeight: '700',
        fontSize: 18,
    },
    alignRight: {
        textAlign: 'right',
        width: 150
    }
});