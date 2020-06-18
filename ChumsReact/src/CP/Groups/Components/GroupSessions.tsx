import React from 'react';
import { ApiHelper, GroupInterface, GroupAdd, DisplayBox, SessionInterface, VisitSessionInterface, PersonInterface, PersonHelper } from './';
import { VisitInterface } from '../../../Utils';

interface Props {
    group: GroupInterface,
    sidebarVisibilityFunction: (name: string, visible: boolean) => void,
    addedSession: SessionInterface,
    addedPerson: PersonInterface,
    addedCallback?: () => void
}

export const GroupSessions: React.FC<Props> = (props) => {
    const [visitSessions, setVisitSessions] = React.useState<VisitSessionInterface[]>([]);
    const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
    const [session, setSession] = React.useState<SessionInterface>(null);

    const loadAttendance = () => ApiHelper.apiGet('/visitsessions?sessionId=' + session.id).then(data => setVisitSessions(data));
    const loadSessions = () => ApiHelper.apiGet('/sessions?groupId=' + props.group.id).then(data => {
        setSessions(data);
        if (data.length > 0) setSession(data[0]);
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.target as HTMLAnchorElement;
        var personId = parseInt(anchor.getAttribute('data-personid'));
        ApiHelper.apiDelete('/visitsessions?sessionId=' + session.id + '&personId=' + personId).then(loadAttendance);
    }
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.sidebarVisibilityFunction('addSession', true); }

    const getRows = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < visitSessions.length; i++) {
            var vs = visitSessions[i];
            result.push(
                <tr>
                    <td><img className="personPhoto" src={PersonHelper.getPhotoUrl(vs.visit.personId, vs.visit.person.photoUpdated)} /></td>
                    <td><a className="personName" href={"/cp/people/person.aspx?id=" + vs.visit.personId}>{vs.visit.person.displayName}</a></td>
                    <td><a href="#" onClick={handleRemove} className="text-danger" data-personid={vs.visit.personId} ><i className="fas fa-user-times"></i> Remove</a></td >
                </tr >
            );
        }
        return result;
    }


    const selectSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
        for (let i = 0; i < sessions.length; i++) if (sessions[i].id == parseInt(e.target.value)) setSession(sessions[i]);
    }

    const getSessionOptions = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < sessions.length; i++) result.push(<option value={sessions[i].id}>{sessions[i].displayName}</option>);
        return result;
    }

    const getHeaderSection = () => {
        return (
            <div className="input-group">
                <select className="form-control" value={session?.id} onChange={selectSession} >{getSessionOptions()}</select>
                <div className="input-group-append">
                    <a href="#" className="btn btn-primary" onClick={handleAdd} ><i className="far fa-calendar-alt"></i> New</a>
                </div>
            </div>
        );
    }

    const handleSessionSelected = () => {
        if (session !== null) {
            loadAttendance();
            props.sidebarVisibilityFunction('addPerson', true);
        }
    }

    const handlePersonAdd = () => {
        var v = { checkinTime: new Date(), personId: props.addedPerson.id, visitSessions: [{ sessionId: session.id }] } as VisitInterface;

        ApiHelper.apiPost('/visitsessions/log', v).then(() => {
            loadAttendance();
        });
        props.addedCallback();
    }

    React.useEffect(() => { if (props.group.id !== undefined) loadSessions(); props.addedCallback(); }, [props.group, props.addedSession]);
    React.useEffect(() => { if (props.addedPerson?.id !== undefined) handlePersonAdd() }, [props.addedPerson]);
    React.useEffect(handleSessionSelected, [session]);


    var content = <></>;
    if (sessions.length == 0) content = <div className="alert alert-warning" role="alert"><b>There are no sessions.</b>  Please add a new session to continue.</div>
    else content = (<>
        <b>Attendance for {props.group.name}</b>
        <table className="table" id="groupMemberTable">
            <tr><th></th><th>Name</th><th>Remove</th></tr>
            {getRows()}
        </table>
    </>);

    return (
        <DisplayBox headerText="Sessions" headerIcon="far fa-calendar-alt" editContent={getHeaderSection()} >
            {content}
        </DisplayBox>


    );
}

