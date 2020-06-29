import React from 'react';
import { ApiHelper, DisplayBox, RoleInterface, RoleEdit, UserHelper } from './Components';
import { Link } from 'react-router-dom'

export const RolesPage = () => {
    const [roles, setRoles] = React.useState<RoleInterface[]>([]);
    const [selectedRoleId, setSelectedRoleId] = React.useState(-1);

    const loadData = () => { ApiHelper.apiGet('/roles').then(data => setRoles(data)); }
    const getEditContent = () => {
        if (!UserHelper.checkAccess('Roles', 'Edit')) return null;
        else return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(0); }} ><i className="fas fa-plus"></i></a>);
    }

    const getRows = () => {
        var result = [];
        const canEdit = UserHelper.checkAccess('Roles', 'Edit');
        for (let i = 0; i < roles.length; i++) {
            const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(roles[i].id); }}><i className="fas fa-pencil-alt"></i></a>) : null;
            result.push(<tr>
                <td><i className="fas fa-lock" /> <Link to={"/cp/settings/roles/" + roles[i].id}>{roles[i].name}</Link></td>
                <td>{editLink}</td>
            </tr>);
        }
        return result;
    }

    const handleUpdate = () => {
        loadData();
        setSelectedRoleId(-1);
    }

    const getSidebar = () => {
        if (selectedRoleId === -1) return <></>
        else return (<RoleEdit roleId={selectedRoleId} updatedFunction={handleUpdate} ></RoleEdit>)
    }

    React.useEffect(loadData, []);

    if (!UserHelper.checkAccess('Roles', 'View')) return (<></>);
    return (
        <>
            <h1><i className="fas fa-lock"></i> Roles</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DisplayBox headerText="Roles" headerIcon="fas fa-lock" editContent={getEditContent()} >
                        <table className="table" id="roleMemberTable">
                            <tr><th>Name</th><th></th></tr>
                            {getRows()}
                        </table>
                    </DisplayBox>
                </div>
                <div className="col-lg-4">
                    {getSidebar()}
                </div>
            </div>
        </>
    );
}
