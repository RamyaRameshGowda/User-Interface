import data from './data.json'
import React, { useEffect, useState } from 'react';
import moment from 'moment'

const UserInterface = () => {
    //State to hold json data
    const [state, setState] = useState([])
    //State to hold selected user object
    const [selectedUser, setSelectedUser] = useState();
    //State to hold selected date
    const [selectedDate, setSelectedDate] = useState(new Date());
    //State to hold user object while filtering 
    const [originalData, setOriginalData] = useState()

    //Trigger when state changes
    useEffect(() => {
        setState(data)
    }, [state])

    //Trigger on select of user
    const getActivityModal = (userObject) => {
        setSelectedDate('');
        setOriginalData(userObject)
        var activityData = userObject.activity_periods.filter(x =>
            new Date(moment.utc(new Date(x.start_time.replace("PM", " PM").replace("AM", " AM"))).format('MM-DD-YYYY')) === selectedDate
        )
        setSelectedUser(activityData)
    }

    //Trigger on date change
    useEffect(() => {
        if (originalData) {
            var activityData = originalData.activity_periods.filter(x => moment.utc(new Date(x.start_time.replace("PM", " PM").replace("AM", " AM"))).format('YYYY-MM-DD') === selectedDate)
            setSelectedUser(activityData)
        }
    }, [selectedDate])

    return (
        <>
            {state?.members?.map((user, index) => {
                return (
                    <div class="card" onClick={() => { getActivityModal(user) }} data-toggle="modal" data-target="#myModal">
                        <div className="container">
                            <h4><b>{user.real_name}</b></h4>
                        </div>
                    </div>
                )
            })}
            <div id="myModal" class="modal fade" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">{originalData?.real_name} - Activity Logs</h4>
                        </div>
                        <div class="modal-body">
                            <div>
                                <input type="date" onChange={(e) => { setSelectedDate(e.target.value) }} />
                                <table>
                                    <tr>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                    <tbody>
                                        {selectedUser && selectedUser.map((activity) => {
                                            return (<tr>
                                                <td>{moment.utc(new Date(activity.start_time.replace("PM", " PM").replace("AM", " AM"))).format('MM-DD-YYYY')}</td>
                                                <td>{moment.utc(new Date(activity.start_time.replace("PM", " PM").replace("AM", " AM"))).format('hh:mm')}</td>
                                                <td>{moment.utc(new Date(activity.end_time.replace("PM", " PM").replace("AM", " AM"))).format('hh:mm')}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default UserInterface;
