import { UserHelper } from './UserHelper';

export class PersonHelper {
    static getPhotoUrl(personId: number, photoUpdated: Date): string {
        if (photoUpdated == null || photoUpdated < new Date(2000, 1, 1)) return "https://chums.org/images/sample-profile.png";
        else return "https://chums.org/content/c/" + UserHelper.church.id + "/p/" + personId + ".png?dt=" + escape(photoUpdated.toString());
    }

    static getAge(birthdate: Date): string {
        if (birthdate !== undefined && birthdate !== null) {
            var ageDifMs = Date.now() - new Date(birthdate).getTime();
            var ageDate = new Date(ageDifMs);
            var years = Math.abs(ageDate.getUTCFullYear() - 1970);
            return years + " years";
        }
        else return "";
    }

    static getDisplayName(firstName: string, lastName: string, nickName: string): string {
        if (nickName !== undefined && nickName !== null && nickName.length > 0) return firstName + ' "' + nickName + '" ' + lastName;
        else return firstName + ' ' + lastName;
    }



}