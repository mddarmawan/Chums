import { injectable } from "inversify";
import { DB } from "../db";
import { Household } from "../models";

@injectable()
export class HouseholdRepository {

    public async save(household: Household) {
        if (household.id > 0) return this.update(household); else return this.create(household);
    }

    public async create(household: Household) {
        return DB.query(
            "INSERT INTO households (churchId, name) VALUES (?, ?);",
            [household.churchId, household.name]
        ).then((row: any) => { household.id = row.insertId; return household; });
    }

    public async update(household: Household) {
        return DB.query(
            "UPDATE households SET name=? WHERE id=? and churchId=?",
            [household.name, household.id, household.churchId]
        ).then(() => { return household });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM households WHERE churchId=?;", [churchId]);
    }

}
