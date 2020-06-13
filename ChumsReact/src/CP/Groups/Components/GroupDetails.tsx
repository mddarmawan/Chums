import React from 'react';
import { Question, ApiHelper, GroupInterface, DisplayBox, GroupDetailsEdit } from './';


interface Props {
    group: GroupInterface,
}

export const GroupDetails: React.FC<Props> = (props) => {

    const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
    const [mode, setMode] = React.useState("display");

    const handleEdit = () => setMode('edit');
    const handleUpdated = (g: GroupInterface) => { setMode('display'); setGroup(g); }

    React.useEffect(() => { setGroup(props.group) }, [props.group]);



    if (mode === 'edit') return <GroupDetailsEdit group={group} updatedFunction={handleUpdated} />
    else return (
        <DisplayBox headerText="Group Details" headerIcon="fas fa-list" editFunction={handleEdit} >
            <div className="row">
                <div className="col"><div><label>Category:</label> {group.categoryName}</div></div>
                <div className="col"><div><label>Name:</label> {group.name}</div></div>
            </div>
            <div className="row">
                <div className="col-lg-6"><div><label>Track Attendance:</label> {(group.trackAttendance?.toString().replace('false', 'No').replace('true', 'Yes') || '')}</div></div>
            </div>
        </DisplayBox>
    );
}
