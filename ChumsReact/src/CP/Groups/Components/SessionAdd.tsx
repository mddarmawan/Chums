import React, { SelectHTMLAttributes } from 'react';
import { ApiHelper, GroupInterface, GroupServiceTimeInterface } from './';
import { InputBox, ErrorMessages, SessionInterface, Helper } from '../../Components';

interface Props { group: GroupInterface, updatedFunction: (session: SessionInterface) => void }

export const SessionAdd: React.FC<Props> = (props) => {
    const [errors, setErrors] = React.useState<string[]>([]);
    const [sessionDate, setSessionDate] = React.useState<Date>(new Date());
    const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
    const [serviceTimeId, setServiceTimeId] = React.useState(0);



    const handleCancel = () => { props.updatedFunction(null); }
    const loadData = () => ApiHelper.apiGet('/groupservicetimes?groupId=' + props.group.id).then(data => {
        setGroupServiceTimes(data);
        if (data.length > 0) setServiceTimeId(data[0].serviceTimeId);
    });


    const handleSave = () => {
        if (validate()) {
            var s = { groupId: props.group.id, sessionDate: sessionDate } as SessionInterface
            if (serviceTimeId > 0) s.serviceTimeId = serviceTimeId;
            ApiHelper.apiPost('/sessions', [s]).then(() => {
                props.updatedFunction(s);
                setSessionDate(new Date());
            });
        }
    }


    const validate = () => {
        var errors: string[] = [];
        if (sessionDate === null || sessionDate < new Date(2000, 1, 1)) errors.push("Invalid date");
        setErrors(errors);
        return errors.length == 0;
    }

    const getServiceTimes = () => {
        if (groupServiceTimes.length == 0) return <></>
        else {
            var options = [];
            for (var i = 0; i < groupServiceTimes.length; i++) {
                let gst = groupServiceTimes[i];
                options.push(<option value={gst.serviceTimeId}>{gst.serviceTime.name}</option>);
            }

            return (
                <div className="form-group">
                    <label>Service Time</label>
                    <select className="form-control" value={serviceTimeId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setServiceTimeId(parseInt(e.target.value)) }} >{options}</select>
                </div>);
        }
    }


    React.useEffect(() => { if (props.group !== null) loadData() }, [props.group]);


    /*
        const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
    
        const loadData = () => ApiHelper.apiGet('/groupservicetimes?groupId=' + props.group.id).then(data => setGroupServiceTimes(data));
    
        const getRows = () => {
            var result: JSX.Element[] = [];
            for (let i = 0; i < groupServiceTimes.length; i++) {
                var gst = groupServiceTimes[i];
                result.push(<div key={gst.id}> {gst.serviceTime.name}</div>);
            }
            return result;
        }
    
        React.useEffect(() => { if (props.group.id !== undefined) loadData() }, [props.group]);
    */
    return (
        <InputBox headerIcon="far fa-calendar-alt" headerText="Add a Session" saveFunction={handleSave} cancelFunction={handleCancel}>
            <ErrorMessages errors={errors} />
            {getServiceTimes()}

            <div className="form-group">
                <label>Session Date</label>
                <input type="date" className="form-control" value={Helper.formatHtml5Date(sessionDate)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionDate(new Date(e.target.value))} />
            </div>
        </InputBox>

    );
}

