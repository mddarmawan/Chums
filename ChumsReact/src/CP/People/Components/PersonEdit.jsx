import React from 'react';
import UserContext from '../../../UserContext'
import PersonHelper from '../../../Utils/PersonHelper'
import Helper from '../../../Utils/Helper'
import StateOptions from '../../Components/StateOptions';
import InputBox from '../../Components/InputBox';
import ApiHelper from '../../../Utils/ApiHelper';
import { Redirect } from 'react-router-dom';
import AddForm from './AddForm';

const PersonEdit = (props) => {
    const [person, setPerson] = React.useState({});
    const [redirect, setRedirect] = React.useState('');

    const handleCancel = e => { e.preventDefault(); props.updatedFunction(person); }

    const handleChange = e => {
        var p = { ...person };
        p[e.target.name] = e.target.value;
        setPerson(p);
    }

    const handleDelete = e => {
        e.preventDefault();
        if (window.confirm('Are you sure you wish to permanently delete this person record?'))
            ApiHelper.apiDelete('/people/' + person.id.toString()).then(() => setRedirect('/cp/people'));
    }

    const handleSave = e => {
        e.preventDefault();
        ApiHelper.apiPost('/people/', [person])
            .then(data => {
                var p = { ...person };
                p.id = data[0];
                p.displayName = PersonHelper.getDisplayName(p.firstName, p.lastName, p.nickname);
                setPerson(p);
                props.updatedFunction(p);
            });
    }

    const getPhoto = () => {
        if (props.person) {
            var url = PersonHelper.getPhotoUrl(1, props.person.id, props.person.photoUpdated)
            return <img src={url} className="img-fluid profilePic" id="imgPreview" alt="avatar" />
        } else return;
    }

    React.useEffect(() => setPerson(props.person), [props.person]);

    if (redirect !== '') return <Redirect to={redirect} />
    else {
        return (
            <InputBox headerIcon="fas fa-user" headerText="Personal Details" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSave} >
                <div className="row">
                    <div className="col-3">{getPhoto()}</div>
                    <div className="col-9">

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={person?.firstName || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Middle Name</label>
                                    <input type="text" name="middleName" value={person?.middleName || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={person?.lastName || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Nickname</label>
                                    <input type="text" name="nickname" value={person?.nickname || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Membership Status</label>
                                    <select name="membershipStatus" value={person?.membershipStatus || ''} onChange={handleChange} className="form-control">
                                        <option value="Visitor">Visitor</option>
                                        <option value="Member">Member</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select name="gender" value={person?.gender || ''} onChange={handleChange} className="form-control">
                                        <option value="Unspecified">Unspecified</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Birthdate</label>
                                    <input type="date" name="birthDate" value={Helper.formatHtml5Date(person?.birthDate)} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Marital Status</label>
                                    <select name="maritalStatus" value={person?.maritalStatus || ''} onChange={handleChange} className="form-control">
                                        <option value="Unknown">Visitor</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Anniversary</label>
                                    <input type="date" name="anniversary" value={Helper.formatHtml5Date(person?.anniversary)} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="row">
                    <div className="col-6">
                        <div className="section">Address</div>
                        <div className="form-group">
                            <label>Line 1</label>
                            <input type="text" name="address1" value={person?.address1 || ''} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Line 2</label>
                            <input type="text" name="address2" value={person?.address2 || ''} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" value={person?.city || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>State</label>
                                    <select name="state" value={person?.state || ''} onChange={handleChange} className="form-control">
                                        <StateOptions />
                                    </select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>Zip</label>
                                    <input type="text" name="zip" value={person?.zip || ''} onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="section">Phone</div>
                        <div className="form-group">
                            <label>Home</label>
                            <input type="text" name="homePhone" value={person?.homePhone || ''} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Work</label>
                            <input type="text" name="workPhone" value={person?.workPhone || ''} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input type="text" name="mobilePhone" value={person?.mobilePhone || ''} onChange={handleChange} className="form-control" />
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="section">Email</div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" name="email" value={person?.email || ''} onChange={handleChange} className="form-control" />
                        </div>
                    </div>
                </div>

                <AddForm person={person} addFormFunction={props.addFormFunction} />

            </InputBox>
        )
    }




}

export default PersonEdit;
