import React, { ChangeEvent } from 'react';
import { InputBox, PersonAdd, PersonHelper, ApiHelper, HouseholdInterface, HouseholdMemberInterface, PersonInterface } from './';


interface Props {
    updatedFunction: () => void,
    household: HouseholdInterface
    members: [HouseholdMemberInterface]


}

export const HouseholdEdit: React.FC<Props> = (props) => {
    const [household, setHousehold] = React.useState<HouseholdInterface>({} as HouseholdInterface);
    const [members, setMembers] = React.useState<HouseholdMemberInterface[]>([]);
    const [showAdd, setShowAdd] = React.useState(false);
    const [dummy, setDummy] = React.useState(null);

    //***I'm cloning the object because otherwise setHoushold won't trigger a re-render.  Is there a better way?
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { let h = { ...household }; h.name = e.target.value; setHousehold(h); }
    const handleCancel = () => { props.updatedFunction(); }
    const handleAdd = () => { setShowAdd(true); }

    const handleRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        var target = e.target as HTMLElement;
        var row = target.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [].concat(members);
        m.splice(idx, 1);
        setMembers(m);
    }

    const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        var row = e.target.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [].concat(members); //***Is this the best way to handle cloning
        m[idx].role = e.target.value;
        setMembers(m);
    }

    const handlePersonAdd = (person: PersonInterface) => {
        var member = { householdId: household.id, personId: person.id, person: person, role: 'Other' };
        var m = [].concat(members);
        m.push(member);
        setMembers(m);
    }

    const handleSave = () => {
        var promises = [];
        promises.push(ApiHelper.apiPost('/households', [household]));
        promises.push(ApiHelper.apiPost('/householdmembers/' + household.id, members));
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
                    <td><img src={PersonHelper.getPhotoUrl(m.personId, m.person.photoUpdated)} alt="avatar" /></td>
                    <td>
                        {m.person.displayName}
                        <select value={m.role} onChange={handleChangeRole} className="form-control form-control-sm">
                            <option value="Head">Head</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Other">Other</option>
                        </select>
                    </td>
                    <td><a href="#" onClick={handleRemove} className="text-danger"><i className="fas fa-user-times"></i> Remove</a></td>
                </tr>
            );
        }
    }

    var personAdd = (showAdd) ? <PersonAdd addFunction={handlePersonAdd} /> : null;
    return (
        <InputBox headerIcon="fas fa-users" headerText={household.name + " Household"} saveFunction={handleSave} cancelFunction={handleCancel} >
            <div className="form-group">
                <label>Household Name</label>
                <input type="text" className="form-control" value={household.name} onChange={handleChange} />
            </div>
            <table className="table table-sm" id="householdMemberTable"><tbody>
                {rows}
                <tr>
                    <td></td>
                    <td></td>
                    <td><a href="#" className="text-success" onClick={handleAdd}> <i className="fas fa-user"></i> Add</a></td>
                </tr>
            </tbody></table>
            {personAdd}

        </InputBox >
    );
}