import React, { ChangeEvent } from 'react';
import { InputBox, PersonAdd, PersonHelper, ApiHelper, HouseholdInterface, PersonInterface } from './';
import { Table } from 'react-bootstrap';

interface Props { updatedFunction: () => void, household: HouseholdInterface, members: PersonInterface[] }

export const HouseholdEdit: React.FC<Props> = (props) => {
    const [household, setHousehold] = React.useState<HouseholdInterface>({} as HouseholdInterface);
    const [members, setMembers] = React.useState<PersonInterface[]>([]);
    const [showAdd, setShowAdd] = React.useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { let h = { ...household }; h.name = e.currentTarget.value; setHousehold(h); }
    const handleCancel = () => { props.updatedFunction(); }
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); setShowAdd(true); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }

    const handleRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        var target = e.currentTarget as HTMLElement;
        var row = target.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [...members];
        m.splice(idx, 1);
        setMembers(m);
    }

    const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        var row = e.currentTarget.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [...members];
        m[idx].householdRole = e.currentTarget.value;
        setMembers(m);
    }

    const handlePersonAdd = (person: PersonInterface) => {
        person.householdId = household.id;
        person.householdRole = "Other";
        var m = [...members];
        m.push(person);
        setMembers(m);

    }

    const handleSave = () => {
        var promises = [];
        promises.push(ApiHelper.apiPost('/households', [household]));
        promises.push(ApiHelper.apiPost('/people/household/' + household.id, members));
        Promise.all(promises).then(() => props.updatedFunction());
    }

    React.useEffect(() => setMembers(props.members), [props.members]);
    React.useEffect(() => setHousehold(props.household), [props.household]);

    var rows = [];
    if (members !== null) {
        for (var i = 0; i < members.length; i++) {
            var m = members[i];
            rows.push(
                <tr key={m.id} data-index={i} >
                    <td><img src={PersonHelper.getPhotoUrl(m)} alt="avatar" /></td>
                    <td>
                        {m.name.display}
                        <select value={m.householdRole} onChange={handleChangeRole} className="form-control form-control-sm" onKeyDown={handleKeyDown} >
                            <option value="Head">Head</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Other">Other</option>
                        </select>
                    </td>
                    <td><a href="about:blank" onClick={handleRemove} className="text-danger"><i className="fas fa-user-times"></i> Remove</a></td>
                </tr>
            );
        }
    }

    var personAdd = (showAdd) ? <PersonAdd addFunction={handlePersonAdd} /> : null;
    return (
        <InputBox id="householdBox" headerIcon="fas fa-users" headerText={household.name + " Household"} saveFunction={handleSave} cancelFunction={handleCancel} >
            <div className="form-group">
                <label>Household Name</label>
                <input name="householdName" type="text" className="form-control" value={household.name} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
            <Table size="sm" id="householdMemberTable">
                <tbody>
                    {rows}
                    <tr><td></td><td></td><td><a href="about:blank" className="text-success" onClick={handleAdd}> <i className="fas fa-user"></i> Add</a></td></tr>
                </tbody>
            </Table>
            {personAdd}
        </InputBox >
    );
}
