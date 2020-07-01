import React from 'react';
import { ApiHelper, PersonInterface, PersonHelper } from './';

interface Props {
    addFunction: (person: PersonInterface) => void

}

export const PersonAdd: React.FC<Props> = (props) => {
    const [searchResults, setSearchResults] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
    const handleSearch = (e: React.MouseEvent) => { e.preventDefault(); ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data)); }
    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = anchor.getAttribute('data-index');
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
                    <td><img src={PersonHelper.getPhotoUrl(sr)} alt="avatar" /></td>
                    <td>{sr.displayName}</td>
                    <td><a href="about:blank" className="text-success" data-index={i} onClick={handleAdd}><i className="fas fa-user"></i> Add</a></td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="input-group">
                <input type="text" className="form-control" value={searchText} onChange={handleChange} />
                <div className="input-group-append"><a href="about:blank" className="btn btn-primary" onClick={handleSearch} ><i className="fas fa-search"></i> Search</a></div>
            </div>
            <table className="table table-sm" id="householdMemberAddTable">
                <tbody>{rows}</tbody>
            </table>
        </>
    );
}