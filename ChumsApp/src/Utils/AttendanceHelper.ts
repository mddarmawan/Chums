import { ApiHelper, Helper, AttendanceRecordInterface } from "./";

export interface AttendanceFilterInterface {
    campusId: number,
    serviceId: number,
    serviceTimeId: number,
    categoryName: string
    groupId: number
    startDate: Date
    endDate: Date,
    groupBy: string
    trend: boolean
}

export class AttendanceHelper {

    static createFilter() {
        var filter: AttendanceFilterInterface = { campusId: 0, serviceId: 0, serviceTimeId: 0, categoryName: '', groupId: 0, startDate: new Date(2000, 1, 1), endDate: new Date(), groupBy: 'campusName', trend: false };
        filter.startDate = Helper.getLastSunday();
        var endDate = Helper.getLastSunday();
        endDate.setDate(endDate.getDate() + 7);
        filter.endDate = endDate;
        return filter;
    }

    static getGroupingName(groupBy: string) {
        var result = 'Grouping'
        switch (groupBy) {
            case 'campusName': result = 'Campus'; break;
            case 'serviceName': result = 'Service'; break;
            case 'serviceTimeName': result = 'Service Time'; break;
            case 'categoryName': result = 'Category'; break;
            case 'groupName': result = 'Group'; break;
            case 'gender': result = 'Gender'; break;
            default: result = 'Grouping'; break;
        }
        return result;
    }


    static loadIndividuals(filter: AttendanceFilterInterface): Promise<any> {
        var url = '/people/attendance'
            + '?campusId=' + filter.campusId
            + '&serviceId=' + filter.serviceId
            + '&serviceTimeId=' + filter.serviceTimeId
            + '&categoryName=' + filter.categoryName
            + '&groupId=' + filter.groupId
            + '&startDate=' + Helper.formatHtml5Date(filter.startDate)
            + '&endDate=' + Helper.formatHtml5Date(filter.endDate)
            + '&groupBy=' + filter.groupBy
            + '&trend=' + filter.trend;
        return ApiHelper.apiGet(url);
    }

    static loadData(filter: AttendanceFilterInterface): Promise<any> {
        var url = '/attendancerecords'
            + '?campusId=' + filter.campusId
            + '&serviceId=' + filter.serviceId
            + '&serviceTimeId=' + filter.serviceTimeId
            + '&categoryName=' + filter.categoryName
            + '&groupId=' + filter.groupId
            + '&startDate=' + Helper.formatHtml5Date(filter.startDate)
            + '&endDate=' + Helper.formatHtml5Date(filter.endDate)
            + '&groupBy=' + filter.groupBy
            + '&trend=' + filter.trend;
        return ApiHelper.apiGet(url);
    }

    static getDisplayName(record: AttendanceRecordInterface) {
        if (record.group !== undefined && record.group.name !== '') return record.group.name;
        else if (record.group !== undefined && record.group.categoryName !== '') return record.group.categoryName;
        else if (record.serviceTime !== undefined && record.serviceTime.name !== '') return record.serviceTime.name;
        else if (record.service !== undefined && record.service.name !== '') return record.service.name;
        else if (record.campus !== undefined && record.campus.name !== '') return record.campus.name;
        else if (record.gender !== undefined && record.gender !== '') return record.gender;
    }
}