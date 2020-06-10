import React, { Fragment } from 'react';
import ApiHelper from '../../Utils/ApiHelper';
import PersonHelper from "../../Utils/PersonHelper";

const PersonAdd = (props) => {
    const [searchResults, setSearchResults] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');

    const handleChange = e => { e.preventDefault(); setSearchText(e.target.value); }
    const handleSearch = e => { e.preventDefault(); ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data)); }
    const handleAdd = e => {
        e.preventDefault();
        var idx = e.target.getAttribute('data-index');
        var sr = searchResults;
        var person = sr.splice(idx, 1)[0];
        setSearchResults(sr);
        props.addFunction(person);
    }

    var rows = [];
    if (searchResults !== null) {
        for (var i = 0; i < searchResults.length; i++) {
            var sr = searchResults[i];
            rows.push(
                <tr key={sr.id}>
                    <td><img src={PersonHelper.getPhotoUrl(sr.d, sr.photoUpdated)} alt="avatar" /></td>
                    <td>{sr.displayName}</td>
                    <td><a href="#" className="text-success" data-index={i} onClick={handleAdd}><i className="fas fa-user"></i> Add</a></td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="input-group">
                <input type="text" className="form-control" value={searchText} onChange={handleChange} />
                <div className="input-group-append"><a href="#" className="btn btn-primary" onClick={handleSearch} ><i className="fas fa-search"></i> Search</a></div>
            </div>
            <table className="table table-sm" id="householdMemberAddTable">
                <tbody>{rows}</tbody>
            </table>
        </>
    );
}

export default PersonAdd;