import React from 'react';
import { ApiHelper, DisplayBox, UserHelper, RoleMemberInterface, PersonHelper, PersonInterface, RoleInterface, ExportLink } from './';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserInterface } from '../../Utils';

interface Props { role: RoleInterface, addedPerson?: PersonInterface, addedCallback?: () => void }

export const RoleMembers: React.FC<Props> = (props) => {

    const [roleMembers, setRoleMembers] = React.useState<RoleMemberInterface[]>([]);
    const [people, setPeople] = React.useState<PersonInterface[]>([]);

    const loadData = React.useCallback(() => {
        ApiHelper.accessGet('/rolemembers/roles/' + props.role.id + '?include=users').then((data: any) => {
            setRoleMembers(data);
            var userIds: number[] = [];
            data.forEach((d: any) => { if (userIds.indexOf(d.userId) === -1) userIds.push(d.userId) });
            ApiHelper.apiGet('/people/userids/?userIds=' + userIds).then(data2 => setPeople(data2));
        });
    }, [props.role]);

    const getEditContent = () => { return (<ExportLink data={roleMembers} spaceAfter={true} filename="rolemembers.csv" />) }
    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        var members = [...roleMembers];
        var member = members.splice(idx, 1)[0];
        setRoleMembers(members);
        ApiHelper.accessDelete('/rolemembers/' + member.id);
    }

    const getMemberByPersonId = React.useCallback((personId: number) => {
        return null;
        /*
        var result = null;
        for (var i = 0; i < roleMembers.length; i++) if (roleMembers[i].personId === personId) result = roleMembers[i];
        return result;*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleMembers]);

    const getPersonByUser = (user: UserInterface) => {
        var result: PersonInterface = { name: { display: user.email }, contactInfo: { email: user.email } };
        people.forEach(p => {
            if (p.userId === user.id) result = p;
        });
        return result;
    }

    const handleAdd = React.useCallback(() => {
        if (getMemberByPersonId(props.addedPerson.id) === null) {
            var rm = { roleId: props.role.id, personId: props.addedPerson.id, person: props.addedPerson } as RoleMemberInterface
            ApiHelper.apiPost('/rolemembers', [rm]);
            var members = [...roleMembers];
            members.push(rm);
            setRoleMembers(members);
            props.addedCallback();
        }
    }, [props, roleMembers, getMemberByPersonId]);

    const getRows = () => {

        var canEdit = UserHelper.checkAccess('Group Members', 'Edit');
        var rows = [];
        for (let i = 0; i < roleMembers.length; i++) {
            var rm = roleMembers[i];
            var p = getPersonByUser(rm.user);
            var editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} className="text-danger" ><i className="fas fa-user-times"></i> Remove</a> : <></>
            rows.push(
                <tr key={i}>
                    <td><img src={PersonHelper.getPhotoUrl(p)} alt="avatar" /></td>
                    <td><Link to={"/people/" + p.id}>{p.name.display}</Link></td>
                    <td>{editLink}</td>
                </tr>
            );
        }
        return rows;
    }


    React.useEffect(() => { if (props.role.id !== undefined) loadData(); }, [props.role, loadData]);
    React.useEffect(() => { if (props.addedPerson?.id !== undefined) handleAdd(); }, [props.addedPerson, handleAdd]);

    return (
        <DisplayBox id="roleMembersBox" headerText="Members" headerIcon="fas fa-users" editContent={getEditContent()} >
            <Table id="roleMemberTable">
                <thead><tr><th></th><th>Name</th><th>Action</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );
}

