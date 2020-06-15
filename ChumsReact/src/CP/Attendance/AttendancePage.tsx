import React from 'react';
import { ApiHelper, DisplayBox, AttendanceInterface, CampusInterface, CampusEdit, ServiceEdit, ServiceInterface, ServiceTimeEdit, ServiceTimeInterface } from './Components';
import { Link } from 'react-router-dom';

export const AttendancePage = () => {
    const [attendance, setAttendance] = React.useState<AttendanceInterface[]>([]);
    const [selectedCampus, setSelectedCampus] = React.useState<CampusInterface>(null);
    const [selectedService, setSelectedService] = React.useState<ServiceInterface>(null);
    const [selectedServiceTime, setSelectedServiceTime] = React.useState<ServiceTimeInterface>(null);

    const handleUpdated = () => { removeEditors(); loadData(); }
    const selectCampus = (campus: CampusInterface) => { removeEditors(); if (campus.name !== 'Undefined') setSelectedCampus(campus); }
    const selectService = (service: ServiceInterface) => { removeEditors(); setSelectedService(service); }
    const selectServiceTime = (service: ServiceTimeInterface) => { removeEditors(); setSelectedServiceTime(service); }
    const loadData = () => { ApiHelper.apiGet('/attendancerecords/groups').then(data => setAttendance(data)); }
    const removeEditors = () => { setSelectedCampus(null); setSelectedService(null); setSelectedServiceTime(null); }

    React.useEffect(() => loadData(), []);

    const getRows = () => {
        var rows = [];
        var lastCampus = '';
        var lastService = '';
        var lastServiceTime = '';
        var lastCategory = '';

        for (var i = 0; i < attendance.length; i++) {
            const a = attendance[i];
            var campus = (a.campus === undefined || a.campus?.name === lastCampus) ? <></> : <><i className="fas fa-church"></i><a href="#" onClick={(e) => { e.preventDefault(); selectCampus(a.campus); }}>{a.campus.name}</a></>
            var service = (a.service === undefined || a.service?.name === lastService) ? <></> : <><i className="far fa-calendar-alt"></i><a href="#" onClick={(e) => { e.preventDefault(); selectService(a.service); }}>{a.service.name}</a></>
            var serviceTime = (a.serviceTime === undefined || a.serviceTime?.name === lastServiceTime) ? <></> : <><i className="far fa-clock"></i><a href="#" onClick={(e) => { e.preventDefault(); selectServiceTime(a.serviceTime); }}>{a.serviceTime.name}</a></>
            var category = (a.group === undefined || a.group?.categoryName === lastCategory) ? <></> : <><i className="far fa-folder"></i>{a.group.categoryName}</>
            var group = (a.group === undefined) ? <></> : <><i className="fas fa-list"></i><Link to={"/cp/groups/" + a.group.id}>{a.group.name}</Link></>

            rows.push(<tr key={i}>
                <td>{campus}</td>
                <td>{service}</td>
                <td>{serviceTime}</td>
                <td>{category}</td>
                <td>{group}</td>
            </tr>);
            lastCampus = a.campus?.name;
            lastService = a.service?.name;
            lastCategory = a.group?.categoryName;
        }

        return rows
    }

    const getEditLinks = () => {
        return (
            <>
                <a id="addBtnGroup" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#" ><i className="fas fa-plus"></i></a>
                <div className="dropdown-menu" aria-labelledby="addBtnGroup">
                    <a className="dropdown-item" href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectCampus({ id: 0, name: 'New Campus' }); }} ><i className="fas fa-church"></i> Add Campus</a>
                    <a className="dropdown-item" href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectService({ id: 0, campusId: 0, name: 'New Service' }); }} ><i className="fas fa-calendar-alt"></i> Add Service</a>
                    <a className="dropdown-item" href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectServiceTime({ id: 0, serviceId: 0, name: 'New Service Time' }); }} ><i className="far fa-clock"></i> Add Service Time</a>
                </div>
            </>
        );
    }




    return (
        <form method="post">
            <h1><i className="far fa-calendar-alt"></i> Attendance</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DisplayBox headerIcon="fas fa-list" headerText="Groups" editContent={getEditLinks()} >
                        <table className="table table-sm table-borderless">
                            <tr><th>Campus</th><th>Service</th><th>Time</th><th>Category</th><th>Group</th></tr>
                            {getRows()}
                        </table >
                    </DisplayBox >
                </div >
                <div className="col-lg-4">
                    <CampusEdit campus={selectedCampus} updatedFunction={handleUpdated} />
                    <ServiceEdit service={selectedService} updatedFunction={handleUpdated} />
                    <ServiceTimeEdit serviceTime={selectedServiceTime} updatedFunction={handleUpdated} />
                </div>
            </div >
        </form >
    );
}
