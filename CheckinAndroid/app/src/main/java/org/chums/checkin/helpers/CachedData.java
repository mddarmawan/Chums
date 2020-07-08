package org.chums.checkin.helpers;

import org.chums.checkin.models.HouseholdMembers;
import org.chums.checkin.models.ServiceTimes;
import org.chums.checkin.models.Visits;

public class CachedData {
    public static String ApiKey;
    public static String ApiRoot = "https://api.chums.org";
    public static String ContentBaseUrl = "https://app.chums.org";
    public static int SelectedPersonId;
    public static int ServiceId;
    public static int ServiceTimeId;
    public static ServiceTimes ServiceTimes;
    public static HouseholdMembers HouseholdMembers;

    public static Visits LoadedVisits;
    public static Visits PendingVisits;
    public static int CheckinPersonId;

}
